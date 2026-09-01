require("./config/loadEnv");

const express = require('express');
const path = require("path");
const cors = require('cors');
const connectToMongo = require('./config/db');
const { CronJob } = require('cron');
const createBackup = require('./utils/backup');

const app = express();
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const originAllowed = (origin) => {
  if (!origin || !corsOrigins.length) return true;
  return corsOrigins.some((pattern) => {
    if (pattern === origin) return true;
    if (pattern.startsWith("*.") && origin.endsWith(pattern.slice(1))) return true;
    return false;
  });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (originAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "AuthToken"],
  })
);

const adminRoutes = require('./api/admin');
const driverRoutes = require('./api/driver');
const ecommerceRoutes = require('./api/ecommerce');
const posRoutes = require('./api/pos');

app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.APP_ENV || "development" });
});

app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/ecommerce', ecommerceRoutes);
app.use('/api/pos', posRoutes);

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
    console.log(
      `Maati API (${process.env.APP_ENV || "development"}) listening at http://localhost:${port}`
    );
  });
};

start().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});
