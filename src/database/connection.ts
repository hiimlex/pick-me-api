import mongoose from "mongoose";

const connection = mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.npivn.mongodb.net/?retryWrites=true&w=majority`
);

export default connection;
