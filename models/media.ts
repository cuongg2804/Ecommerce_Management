
import { timeStamp } from "console";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    folder: String,
    filename: String,
    mimetype: String,
    size: Number
  },
  {
    timestamps: true
  }
);

const Media = mongoose.model("Media", schema,
  "media"
);

export default Media;