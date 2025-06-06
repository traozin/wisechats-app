import axios from "axios";
import dotenv from "dotenv";
import Cookie from "js-cookie";

dotenv.config();

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
});

export const authHeader = () => ({
    Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
});