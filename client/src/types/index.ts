export interface Camera {
  id: number;
  category: number;
  code: string;
  name: string;
  url: string;
  wsPort: number;
  active: boolean;
  banker: number;
  player: number;
  tie: number;
  total: number;
}

export interface JSMpegPlayer {
  destroy: () => void;
}

export type Role = {
  _id: string;
  name: string;
  is_default_admin: boolean;
  created_at: Date;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  role: Role;
  created_at: Date;
};

export type Category = {
  _id: string;
  name: string;
  created_at: Date;
};

export type Game = {
  _id: string;
  name: string;
  url: string;
  wsPort: number;
  active: boolean;
  category: Category;
  created_at: Date;
};

export type NiuniuResult = {
  _id: string;
  banker: number;
  player1: number;
  player2: number;
  player3: number;
};
