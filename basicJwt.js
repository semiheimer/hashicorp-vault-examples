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
    // Performing token authentication to Vaul
    const response = await axios.post(VAULT_JWT_AUTH_URL, { jwt: token });

    if (response.data.auth.client_token) {
      req.vaultToken = response.data.auth.client_token; // Store the client_token retrieved from Vault
      return next(); // Token validated
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
}

// Protected route example
app.get("/secret", verifyJwtToken, (req, res) => {
  res.json({
    message: "You have access to the secret!",
    vaultToken: req.vaultToken,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
