const path = require("path");
const dotenv = require("dotenv");

const root = path.join(__dirname, "../..");

dotenv.config({ path: path.join(root, ".env") });

const appEnv = process.env.APP_ENV || "development";
dotenv.config({ path: path.join(root, `.env.${appEnv}`) });

if (!process.env.APP_ENV) {
  process.env.APP_ENV = appEnv;
}

module.exports = { appEnv: process.env.APP_ENV };
