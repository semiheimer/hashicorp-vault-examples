# hashicorp vault

## 1st Method: Access via Container IP
docker container ip al ve onunla eriş
docker inspect vault-server | grep IPAddress
export VAULT_ADDR="http://ip:8200"

## 2nd Method: Direct Access

docker run -d --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' -p 8200:8200 --name=dev-vault hashicorp/vault

## Download Vault CLI and Add to Windows System Path
## cli'ın vaulta erişim adresini ayarla
set VAULT_ADDR=http://127.0.0.1:8200

## Check Version
vault --version
## Login
vault login
token=baslangıçta verilen token id olacak

## Create Secret
vault kv put secret/semih semihpassword=test123
## Retrieve Secret
vault kv get secret/semih 
## Delete Secret
vault kv delete secret/semih 
## Node.js Client Package
https://developer.hashicorp.com/vault/api-docs/libraries
node-vault

## Enable Custom Secret Engine
// secret/semih
vault secrets enable -path=secret kv

## Enable AWS Secret Engine
vault secrets enable -path=aws kv
## Retrieve Secret in JSON Format
vault kv get -format=json secret/semih 

## Disable Secret Engine
vault secrets disable aws

## List All Secret Engines
vault secrets list

## Create Dynamic Secret
vault secrets enable -path=aws aws 
## Set Root Configuration for AWS

vault write aws/config/root \
access_key=blablabla \
secret_key=blablabla \
region=eu-north-1

## Configure Role for EC2
vault write awas/roles/my-ec2-role \
      credential_type=iam_user \
      policy_document=-<<EOF
{ 
"Version":"2024-10-17",
"Statement":
 [
   {
    "Sid":"Stmt1426423423",
    "Effect":"Allow",
    "Action":["ec2:*"],
    "Reource":["*"]
   }
 ]
}     

# Retrieve Role Credentials
vault read aws/creds/my-ec2-role

# Lease Duration
Lease duration is set to 768h (768 hours). To revoke the lease:
# lease revoke
vault lease revoke aws/creds/my-ec2-role /lease_id

## Token Authentication
 ### policy format
 ### write policy
 ### test policy
 ### auth method & policy
### Policy Format
To define policies, create and test them for different auth methods and policies.

# Vault Policy Example
path "secret/*" {
  capabilities = ["create", "read", "update", "delete"]
}
This policy grants create, read, update, and delete access to all secrets under the secret/* path.

# Path for Creating Tokens
path "auth/token/create" {
  capabilities = ["create"]
}

path "sys/mounts" {
  capabilities = ["read"]
}

# List Policies
vault policy list
# Read a Specific Policy
vault policy read my-policy

# Delete a policy
vault policy delete my-policy

# Create a Token
vault token create

# Root Token root için password gibi düşünülebilir 

# Attach Token to Policy
To attach a token to a policy:

export VAULT_TOKEN="$(vault token create -field token -policy=my-policy)"

# Write Secret with Specific Mount
To write a secret to a specific mount:

vault kv put -mount=secret creds password="my password"

# Vault Express JWT Authentication Example
## Enable JWT Authentication Backend
vault auth enable jwt

## Configure JWT Authentication
vault write auth/jwt/config \
    oidc_discovery_url="https://your-oidc-provider.com/.well-known/openid-configuration" \
    oidc_client_id="your-client-id" \
    oidc_client_secret="your-client-secret"
## Write a Vault Policy for JWT
vault policy write my-policy -<<EOF
path "secret/data/*" {
  capabilities = ["read"]
}
EOF
## Express.js JWT Authentication Middleware
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const port = 3000;

// Vault JWT Auth URL
const VAULT_JWT_AUTH_URL = 'http://localhost:8200/v1/auth/jwt/login';

// Middleware to verify JWT token via Vault
async function verifyJwtToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
     // Verify token with Vault
    const response = await axios.post(VAULT_JWT_AUTH_URL, { jwt: token });
    
    if (response.data.auth.client_token) {
      req.vaultToken = response.data.auth.client_token;
      return next(); // Token doğrulandı, devam et
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
}

// Protected route
app.get('/secret', verifyJwtToken, (req, res) => {
  res.json({ message: 'You have access to the secret!', vaultToken: req.vaultToken });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

# Retrieve Secret from Vault
async function getSecretFromVault(token) {
  const response = await axios.get('http://localhost:8200/v1/secret/data/my-secret', {
    headers: {
      'X-Vault-Token': token,
    }
  });

  return response.data.data;
}

# Authentication Methods
## List all authentication methods:
vault auth list
## nable the AppRole authentication method:
vault auth enable approle


