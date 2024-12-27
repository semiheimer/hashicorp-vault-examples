# Start with the base image
FROM debian:bullseye

# Set environment variables to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    sudo \
    lsb-release \
    wget \
    ca-certificates \
    unzip && \
    # Add HashiCorp's GPG key
    wget -O - https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    # Add HashiCorp's APT repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list && \
    # Update package list and install Vault
    apt-get update && apt-get install -y vault && \
    # Clean up unnecessary files to reduce image size
    rm -rf /var/lib/apt/lists/*

# Verify installation
RUN vault --version

# Set the default command to run Vault in development mode
CMD ["vault", "server", "-dev"]
