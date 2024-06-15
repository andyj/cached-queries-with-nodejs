const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { Redis } = require('ioredis');
const crypto = require('crypto');
require('dotenv').config(); // Load environment variables from .env file in the root of the project

const { REDISHOST, REDISPORT, REDISPW } = process.env;
console.log(REDISHOST, REDISPORT, REDISPW)

const app = express();
const port = 8001;

// Set up Redis client
const client = new Redis({
  host: REDISHOST,
  port: REDISPORT,
  password: REDISPW, // Replace with your Redis password
  // Remove username field if not needed
  no_ready_check: true
});

client.on('error', (err) => {
  console.error('Redis client error', err);
});

// Set up SQLite3 database connection
const db = new sqlite3.Database('./your-database.sqlite');

// Utility function to get data from SQLite3
function getDataFromDB(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to get cached data or fetch from DB
async function getCachedData(query, params, cacheDuration, userId) {
  const paramString = JSON.stringify(params);
  const hash = crypto.createHash('md5').update(query + paramString + userId + cacheDuration).digest('hex');
  const cacheKey = `sql_cache_${userId}_${hash}`;

  try {
    const result = await client.get(cacheKey);
    if (result) {
      return JSON.parse(result);
    } else {
      const data = await getDataFromDB(query, params);
      await client.setex(cacheKey, cacheDuration, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    throw err;
  }
}

// Example route
app.get('/data', async (req, res) => {
  const userId = req.query.userId || 'default_user'; // Replace with actual user ID/session ID retrieval logic
  const query = 'SELECT time()';
  const params = [];
  const cacheDuration = 5; // 5 seconds

  try {
    const data = await getCachedData(query, params, cacheDuration, userId);
    res.json(data);
  } catch (error) {
		console.log(error)
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
