import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME);
  }
  return db;
};
export default connectDB;
