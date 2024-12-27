What is HashiCorp Vault?

HashiCorp Vault is a security management solution that ensures secure storage and access control for sensitive data such as passwords, API keys, and certificates across applications, infrastructures, and users. It provides centralized management for secrets, their access, and lifecycle.

# Key Features of HashiCorp Vault
## 1. Secret Storage and Management

Securely stores sensitive information such as passwords, API keys, and TLS certificates.
Data is encrypted and can only be accessed by authorized users/applications.
## 2. Dynamic Secrets Generation

Generates dynamic credentials (e.g., temporary usernames and passwords) for applications.
For instance, Vault can create temporary credentials for accessing a database.
## 3.Secret Auditing and Authorization

Supports audit mechanisms to track who accessed what and when.
Role-Based Access Control (RBAC) is used to limit access to secrets.
## 4.Encryption Services

Provides encryption and decryption services for application-specific data.
## 5.Multi-Platform and Environment Support

Can integrate with on-premise environments, cloud platforms (AWS, Azure, Google Cloud), and Kubernetes.

# What Does HashiCorp Vault Do?
## 1.Centralized Secret Management

Manages sensitive data used across multiple applications and systems centrally.
## 2.Automates Secret Lifecycle

Manages the lifecycle of secrets by automatically rotating or revoking them after a certain period.
## 3.Dynamic Credentials Creation

Vault can issue temporary credentials (e.g., passwords) that are valid for a specific time.
## 4.Access Control and Auditing

Provides fine-grained access control based on policies, ensuring compliance with organizational security rules.
Logs all access attempts and provides detailed reports.
## 5.Encryption Key Management

Securely stores and manages encryption keys, and automates their rotation.
# Use Case Scenarios
## 1. Managing API Keys

Safely store and manage API keys used across multiple applications.
## 2.Dynamic Database Credentials

Generate temporary credentials for database access for each session.
## 3.Cloud Access Management

Create and revoke IAM role access keys for cloud environments like AWS.
## 4.Encryption Key Management

Provide encryption services to securely handle application-specific data.
# Benefits of HashiCorp Vault
## Security: 
Centralized storage ensures that sensitive data is protected.
## Automation: 
Automates the lifecycle management of secrets and access processes.
## Auditing: 
Tracks and reports all access attempts.
## Compliance: 
Helps in meeting organizational security policies and regulatory requirements.
# Token Authentication and Policy Management with Vault
## Token Authentication

Token authentication is a method used to verify the identity of a user or application using tokens (often JWT or other formats). This method facilitates secure and asynchronous authentication between systems.

## Token Authentication Features

### JWT (JSON Web Token): 
A widely used token type consisting of three parts: header, payload (claims), and signature.
### OAuth 2.0:
 A common protocol used to acquire tokens and provide secure access.

# Policy Format

HashiCorp Vault uses policies to define what resources users, applications, and services can access. These policies are associated with tokens to specify permissions for different users.

## Policy Structure

Vault policies are written in HashiCorp Configuration Language (HCL). Here's an example:

### Full access to the secret path
path "secret/*" {
  capabilities = ["create", "read", "update", "delete"]
}

### Permission to create tokens
path "auth/token/create" {
  capabilities = ["create"]
}

### Permission to read system mount information
path "sys/mounts" {
  capabilities = ["read"]
}

## Write Policy

You can write policies to define permissions for specific paths. Here's an example:

hcl

## Read permission for user secrets
path "secret/data/users/*" {
  capabilities = ["read"]
}

# Admin permission for token creation and management
path "auth/token/*" {
  capabilities = ["create", "update", "delete", "list"]
}

# Read permission for system mount information
path "sys/mounts" {
  capabilities = ["read"]
}
## Testing Policies

You can test your policies using Vault's tools.

### List Policies: 
vault policy list
### View Policy Details:
 vault policy read <policy_name>
### Apply Policy:
 vault policy write <policy_name> <policy_file>
### Test Access with Token:
 vault token lookup <token>

# Auth Methods and Policy in Vault
## Auth Method

Vault offers multiple authentication methods to verify the identity of users or services:

### Token Authentication: 
The most common method for accessing Vault.
### AppRole Authentication:
 Used for authenticating applications with specific roles and tokens.
### LDAP Authentication:
 Integrates with LDAP servers.
### OIDC Authentication:
 Uses OpenID Connect for authentication.
### Userpass Authentication:
 Uses username and password for authentication.

## Using Auth Methods

You can enable auth methods and associate users with policies. Example:

### Enable Userpass Auth Method:

vault auth enable userpass

### Create User and Assign Policies:

vault policy write my-policy my-policy.hcl
vault write auth/userpass/users/john password="password" policies="my-policy"

In this example, the userpass auth method is used to create a user john, who is assigned the my-policy policy. The policy determines the paths that the user can access, such as read or write permissions on certain resources.