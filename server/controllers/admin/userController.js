import User from "../../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find().populate("role", "name");
  res.json(users);
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("role", "name");
  res.json(user);
};

export const createUser = async (req, res) => {
  const { first_name, last_name, username, email, role, password } = req.body;
  const user = new User({
    first_name,
    last_name,
    username,
    email,
    role,
    password,
  });
  console.log("req==>", req.body);
  await user.save();
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, username, email, role, password } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { first_name, last_name, username, email, role, password },
    { new: true }
  );
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted" });
};
