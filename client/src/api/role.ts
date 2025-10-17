import { Role } from "@/types";
import API from "./axios";

export const getRoles = async (): Promise<Role[]> => {
  const { data } = await API.get("/admin/roles");
  return data;
};

export const getRole = async (_id: string): Promise<Role> => {
  const { data } = await API.get(`/admin/roles/${_id}`);
  return data;
};

export const createRole = async (payload: { name: string }) => {
  const { data } = await API.post("/admin/roles", payload);
  return data;
};

export const updateRole = async (_id: string, payload: { name: string }) => {
  const { data } = await API.put(`/admin/roles/${_id}`, payload);
  return data;
};

export const deleteRole = async (_id: string) => {
  const { data } = await API.delete(`/admin/roles/${_id}`);
  return data;
};
