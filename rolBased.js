const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Vault JWT Auth URL
const VAULT_JWT_AUTH_URL = "http://localhost:8200/v1/auth/jwt/login";

// Middleware to verify JWT token via Vault
async function verifyJwtToken(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Vault'a token doğrulaması yapma
    const response = await axios.post(VAULT_JWT_AUTH_URL, { jwt: token });

    if (response.data.auth.client_token) {
      req.vaultToken = response.data.auth.client_token; // Vault'tan alınan client_token'ı sakla
      req.userRole = response.data.auth.policies[0]; // Kullanıcının rolünü alın
      return next(); // Token doğrulandı, devam et
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
}

// Role-based access control (RBAC)
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.userRole === role) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
  };
}

// Protected route for users with 'admin' role
app.get("/admin", verifyJwtToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

// Protected route for users with 'user' role
app.get("/user", verifyJwtToken, authorizeRole("user"), (req, res) => {
  res.json({ message: "User access granted" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
