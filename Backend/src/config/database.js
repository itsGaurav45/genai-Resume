const mongoose = require("mongoose");

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interview-master";

    try {
        console.log(`Connecting to MongoDB (${mongoUri.includes("mongodb+srv") ? "MongoDB Atlas" : "Local"})...`);
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to Database ✅");
    } catch (err) {
        console.error("❌ Database connection error:", err.message);

        if (mongoUri.includes("mongodb+srv://") || mongoUri.includes("mongodb.net")) {
            console.error("\n💡 Troubleshooting MongoDB Atlas Connection:");
            console.error("1. Check if your Atlas cluster is PAUSED in https://cloud.mongodb.com and click 'Resume'.");
            console.error("2. Ensure your IP address is whitelisted in Atlas (Network Access -> Add IP -> 0.0.0.0/0).");
            console.error("3. Verify your username, password, and cluster URI in Backend/.env.\n");
        }

        const localUri = "mongodb://127.0.0.1:27017/interview-master";
        if (mongoUri !== localUri) {
            console.log("Attempting fallback connection to local MongoDB...");
            try {
                await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
                console.log("Connected to Local Database as fallback ✅");
                return;
            } catch (localErr) {
                console.error("Local MongoDB fallback also failed:", localErr.message);
            }
        }

        process.exit(1);
    }
}

module.exports = connectToDB;
