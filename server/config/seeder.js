import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./../models/User.js";
import Role from "./../models/Role.js";
import Permission from "./../models/Permission.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Role.deleteMany();
    await Permission.deleteMany();
    console.log("Cleared users, roles, and permissions");

    const permissionNames = [
      "create_user",
      "edit_user",
      "delete_user",
      "view_user",
      "create_role",
      "edit_role",
      "delete_role",
      "view_role",
    ];

    const permissions = await Permission.insertMany(
      permissionNames.map((name) => ({ name }))
    );
    console.log("Permissions seeded");

    const permMap = {};
    permissions.forEach((perm) => {
      permMap[perm.name] = perm._id;
    });

    const roles = await Role.insertMany([
      {
        name: "admin",
        permissions: permissions.map((p) => p._id),
      },
      {
        name: "editor",
        permissions: [
          permMap["edit_user"],
          permMap["view_user"],
          permMap["edit_role"],
          permMap["view_role"],
        ],
      },
      {
        name: "viewer",
        permissions: [permMap["view_user"], permMap["view_role"]],
      },
    ]);
    console.log("Roles seeded");

    const adminRole = roles.find((r) => r.name === "admin");

    const user = new User({
      first_name: "Admin",
      last_name: "User",
      username: "admin",
      email: "admin@example.com",
      password: "123456",
      role: adminRole._id,
    });

    await user.save();
    console.log("Admin user created");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
