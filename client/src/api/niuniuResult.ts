import { NiuniuResult } from "@/types";
import API from "./axios";

export const getNiuniuResults = async (): Promise<NiuniuResult[]> => {
  const { data } = await API.get("/admin/niuniu_results");
  return data;
};

export const getNiuniuResult = async (_id: string): Promise<NiuniuResult> => {
  const { data } = await API.get(`/admin/niuniu_results/${_id}`);
  return data;
};

export const createNiuniuResult = async (payload: {
  banker: number;
  player1: number;
  player2: number;
  player3: number;
}) => {
  const { data } = await API.post("/admin/niuniu_results", payload);
  return data;
};

export const updateNiuniuResult = async (
  _id: string,
  payload: {
    banker: number;
    player1: number;
    player2: number;
    player3: number;
  }
) => {
  const { data } = await API.put(`/admin/niuniu_results/${_id}`, payload);
  return data;
};

export const deleteNiuniuResult = async (_id: string) => {
  const { data } = await API.delete(`/admin/niuniu_results/${_id}`);
  return data;
};
