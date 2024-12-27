const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Vault JWT Auth URL
const VAULT_JWT_AUTH_URL = "http://localhost:8200/v1/auth/jwt/login";

// Middleware to verify JWT token via Vault with refresh token handling
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
      req.tokenExpiration = response.data.auth.metadata.expiration; // Token'ın geçerlilik süresi
      return next(); // Token doğrulandı, devam et
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
}

// Example protected route that requires a valid token
app.get("/profile", verifyJwtToken, (req, res) => {
  res.json({
    message: "You have access to your profile!",
    vaultToken: req.vaultToken,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
