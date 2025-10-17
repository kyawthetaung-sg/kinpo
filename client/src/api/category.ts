import { Category } from "@/types";
import API from "./axios";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await API.get("/admin/categories");
  return data;
};

export const getCategory = async (_id: string): Promise<Category> => {
  const { data } = await API.get(`/admin/categories/${_id}`);
  return data;
};

export const createCategory = async (payload: { name: string }) => {
  const { data } = await API.post("/admin/categories", payload);
  return data;
};

export const updateCategory = async (
  _id: string,
  payload: { name: string }
) => {
  const { data } = await API.put(`/admin/categories/${_id}`, payload);
  return data;
};

export const deleteCategory = async (_id: string) => {
  const { data } = await API.delete(`/admin/categories/${_id}`);
  return data;
};
