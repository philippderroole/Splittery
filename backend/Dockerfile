# Use the official Rust image as the base image
FROM rust:slim as builder

# Create a new directory for the application
RUN mkdir -p /usr/src/splittery_backend
WORKDIR /usr/src/splittery_backend

# Copy the Rust project into the container
COPY . .

ENV SQLX_OFFLINE=true

# Build the Rust project
RUN cargo install --path .

# Use Debian Bullseye slim as the base image
FROM debian:12-slim

# Copy the binary from the builder image to the new image
COPY --from=builder /usr/local/cargo/bin/splittery_backend /usr/local/bin/splittery_backend

ENV LISTEN_URL=0.0.0.0
ENV LISTEN_PORT=8000

# Expose the port that the application will run on
EXPOSE 8000

# Start the application
CMD ["splittery_backend"]
