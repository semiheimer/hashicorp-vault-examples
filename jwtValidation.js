const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Vault JWT Auth URL ve Secret Path
const VAULT_JWT_AUTH_URL = "http://localhost:8200/v1/auth/jwt/login";
const VAULT_SECRET_PATH = "http://localhost:8200/v1/secret/data/my-secret";

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

// Protected route to get secret from Vault
async function getSecretFromVault(token) {
  const response = await axios.get(VAULT_SECRET_PATH, {
    headers: {
      "X-Vault-Token": token,
    },
  });
  return response.data.data;
}

// Example protected route that retrieves a secret from Vault
app.get("/secret", verifyJwtToken, async (req, res) => {
  try {
    const secret = await getSecretFromVault(req.vaultToken);
    res.json({ secret });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving secret", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
