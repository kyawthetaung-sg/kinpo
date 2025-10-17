import { User } from "@/types";
import API from "./axios";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await API.get("/admin/users");
  return data;
};

export const getUser = async (_id: string): Promise<User> => {
  console.log("id==>", _id);
  const { data } = await API.get(`/admin/users/${_id}`);
  console.log("data==>", data);
  return data;
};

export const createUser = async (payload: {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  role: string;
}) => {
  const { data } = await API.post("/admin/users", payload);
  return data;
};

export const updateUser = async (
  _id: string,
  payload: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    role: string;
  }
) => {
  const { data } = await API.put(`/admin/users/${_id}`, payload);
  return data;
};

export const deleteUser = async (_id: string) => {
  const { data } = await API.delete(`/admin/users/${_id}`);
  return data;
};
