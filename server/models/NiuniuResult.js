import mongoose from "mongoose";

const niuniuSchema = new mongoose.Schema({
  banker: { type: Number, required: true },
  player1: { type: Number, required: true },
  player2: { type: Number, required: true },
  player3: { type: Number, required: true },
});

const NiuniuResult =
  mongoose.models.NiuniuResult || mongoose.model("NiuniuResult", niuniuSchema);

export default NiuniuResult;
