import Game from "../../models/Game.js";

export const getGames = async (req, res) => {
  const games = await Game.find().populate("category", "name");
  res.json(games);
};

export const getGame = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id).populate("category", "name");
  res.json(game);
};

export const createGame = async (req, res) => {
  const { name, category, url } = req.body;
  const game = new Game({ name, category, url });
  await game.save();
  res.status(201).json(game);
};

export const updateGame = async (req, res) => {
  const { id } = req.params;
  const { name, category, url } = req.body;
  const game = await Game.findByIdAndUpdate(
    id,
    { name, category, url },
    { new: true }
  );
  res.json(game);
};

export const deleteGame = async (req, res) => {
  const { id } = req.params;
  await Game.findByIdAndDelete(id);
  res.json({ message: "Game deleted" });
};
