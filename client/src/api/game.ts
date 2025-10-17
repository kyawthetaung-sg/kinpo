import { Game } from "@/types";
import API from "./axios";

export const getGames = async (): Promise<Game[]> => {
  const { data } = await API.get("/admin/games");
  return data;
};

export const getGame = async (_id: string): Promise<Game> => {
  const { data } = await API.get(`/admin/games/${_id}`);
  return data;
};

export const createGame = async (payload: {
  name: string;
  category: string;
  url: string;
}) => {
  const { data } = await API.post("/admin/games", payload);
  return data;
};

export const updateGame = async (
  _id: string,
  payload: {
    name: string;
    category: string;
    url: string;
  }
) => {
  const { data } = await API.put(`/admin/games/${_id}`, payload);
  return data;
};

export const deleteGame = async (_id: string) => {
  const { data } = await API.delete(`/admin/games/${_id}`);
  return data;
};

export const startAllGames = async () => {
  const res = await API.post("/games/start-all");
  return res.data;
};
