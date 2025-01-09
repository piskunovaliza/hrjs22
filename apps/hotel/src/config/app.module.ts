import mongoose from "mongoose";
import { logger } from "./loggerConfig";

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; 

export async function connectDB() {
  const link = process.env.MONGO_URI;
  if (!link) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(link);
      logger.info("Connected to MongoDB");
      break;
    } catch (error) {
      retries++;
      logger.error(
        `Failed to connect to MongoDB (attempt ${retries}/${MAX_RETRIES}): ${error.message}`
      );

      if (retries === MAX_RETRIES) {
        logger.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      logger.info(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, async () => {
    logger.info(`Received signal ${signal}. Closing MongoDB connection...`);
    await mongoose.connection.close();
    logger.info("MongoDB connection closed. Exiting...");
    process.exit();
  })
);