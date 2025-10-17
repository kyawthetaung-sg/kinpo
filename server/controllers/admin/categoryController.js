import Category from "../../models/Category.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  res.json(category);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.json({ message: "Category deleted" });
};
