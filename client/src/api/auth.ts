import API from "./axios";

export const userLogin = async (payload: {
  emailOrUsername: string;
  password: string;
}) => {
  const { data } = await API.post("/admin/login", payload);
  return data;
};
