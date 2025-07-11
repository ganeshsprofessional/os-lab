import mongoose from "mongoose";

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  console.log("Connecting to Mongodb " + MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    // await mongoose.connection.db.dropDatabase();
    console.log("Connected to db");
  } catch (e) {
    console.log({ MONGODB_URI });
    console.log(e);
  }
}
