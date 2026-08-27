const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv');
const connectToMongo = require('./config/db');
const { CronJob } = require('cron');
const createBackup = require('./utils/backup');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "AuthToken"],
  })
);

const adminRoutes = require('./api/admin');
const driverRoutes = require('./api/driver');
const ecommerceRoutes = require('./api/ecommerce');

app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

const start = async () => {
  await connectToMongo();
  const job = new CronJob(
    '0 0 * * *',
    function () {
      console.log('Starting MongoDB backup...');
      createBackup();
    },
    null,
    true,
    'Australia/Sydney'
  );
  void job;
  app.listen(port, () => {
    console.log(`E-commerce backend listening at http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});
