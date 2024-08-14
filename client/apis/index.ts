import { DetailFamilyType, ListFamilyType } from "@/types/family";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL + "/api/",
  headers: {
    "Content-type": "application/json",
  },
});

export const getDetailFamily = async (params: DetailFamilyType) => {
  const response = await api.get(`families/detail/${params?.id}`);
  return response.data;
};

export const getListFamily = async (params: ListFamilyType) => {
  const response = await api.post("families/getList", params);
  return response.data;
};
