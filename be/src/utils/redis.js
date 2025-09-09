import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;
