import Role from "../../models/Role.js";

export const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

export const getRole = async (req, res) => {
  const { id } = req.params;
  const role = await Role.findById(id);
  res.json(role);
};

export const createRole = async (req, res) => {
  const { name, permissions } = req.body;
  const role = new Role({ name, permissions });
  await role.save();
  res.status(201).json(role);
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const role = await Role.findByIdAndUpdate(
    id,
    { name, permissions },
    { new: true }
  );
  res.json(role);
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  await Role.findByIdAndDelete(id);
  res.json({ message: "Role deleted" });
};
