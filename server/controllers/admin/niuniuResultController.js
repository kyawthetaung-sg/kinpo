import NiuniuResult from "../../models/NiuniuResult.js";

export const getNiuniuResults = async (req, res) => {
  const niuniuResults = await NiuniuResult.find();
  res.json(niuniuResults);
};

export const getNiuniuResult = async (req, res) => {
  const { id } = req.params;
  const niuniuResult = await NiuniuResult.findById(id);
  res.json(niuniuResult);
};

export const createNiuniuResult = async (req, res) => {
  const { banker, player1, player2, player3 } = req.body;
  const niuniuResult = new NiuniuResult({ banker, player1, player2, player3 });
  await niuniuResult.save();
  res.status(201).json(niuniuResult);
};

export const updateNiuniuResult = async (req, res) => {
  const { id } = req.params;
  const { banker, player1, player2, player3 } = req.body;
  const niuniuResult = await NiuniuResult.findByIdAndUpdate(
    id,
    { banker, player1, player2, player3 },
    { new: true }
  );
  res.json(niuniuResult);
};

export const deleteNiuniuResult = async (req, res) => {
  const { id } = req.params;
  await NiuniuResult.findByIdAndDelete(id);
  res.json({ message: "NiuniuResult deleted" });
};
