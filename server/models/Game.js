import mongoose from "mongoose";

const wsPorts = [
  9999, 9998, 9997, 9996, 9995, 9994, 9993, 9992, 9991, 9990, 9989, 9987, 9986,
  9985, 9984, 9983, 9982, 9981, 9980,
];

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  url: { type: String, required: true },
  wsPort: { type: Number, required: true, unique: true },
  wsPort: {
    type: Number,
    required: true,
    unique: true,
    default: () => wsPorts[Math.floor(Math.random() * wsPorts.length)],
  },
  active: { type: Boolean, required: true, default: true },
});

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

export default Game;
