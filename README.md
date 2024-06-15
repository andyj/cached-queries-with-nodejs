
## Cached Queries With Nodejs

I'm still a CFML coder at heart, so this is a personal project to replicate something similar to CFML Query Caching. It demonstrates how to set up a Node.js application with a RDBMS (SQLite3 for now) and Redis for caching query results. Each user’s query results are cached uniquely based on their user ID and query parameters. This setup aims to replicate caching of queries.

## Environment Setup

Create a `.env` file in the root of your project with the following content. This file will store your Redis connection details securely.

```plaintext
# .env

# The hostname or IP address of your Redis server
REDISHOST="localhost"

# The port number on which your Redis server is running
REDISPORT="6379"

# The password for your Redis server (if applicable)
REDISPW="passwd"
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/andyj/cached-queries-with-nodejs.git
   cd cached-queries-with-nodejs
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Access the example route:**
   - Open your browser and navigate to `http://localhost:8001/data`.
3. **Output**
   - The output should be a time stamp `[{"time()":"09:38:46"}]` which does not change for 5 seconds.
