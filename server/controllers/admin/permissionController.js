import Permission from "../../models/Permission.js";

export const getPermissions = async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
};

export const createPermission = async (req, res) => {
  const { name } = req.body;
  const permission = new Permission({ name });
  await permission.save();
  res.status(201).json(permission);
};

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const permission = await Permission.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  res.json(permission);
};

export const deletePermission = async (req, res) => {
  const { id } = req.params;
  await Permission.findByIdAndDelete(id);
  res.json({ message: "Permission deleted" });
};
