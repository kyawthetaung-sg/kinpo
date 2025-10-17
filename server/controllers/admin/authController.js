import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res
      .status(401)
      .json({
        message: "Invalid email or username. Please check and try again.",
      });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "Invalid password. Please check and try again." });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
};

export default loginUser;
