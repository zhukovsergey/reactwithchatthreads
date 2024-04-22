import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
const signupUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, username } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      name,
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default signupUser;
