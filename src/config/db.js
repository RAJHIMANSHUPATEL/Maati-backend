const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectToMongo = async (retries = 8) => {
    const URL = process.env.MONGO_URL;
    if (!URL) {
        throw new Error("MONGO_URL is missing");
    }
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            const db = await mongoose.connect(URL);
            console.log(db.connection.host, "connected");
            return db;
        } catch (error) {
            lastError = error;
            console.log(`Mongo connect failed (${attempt}/${retries}):`, error.message);
            await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
        }
    }
    throw lastError;
};

module.exports = connectToMongo;
