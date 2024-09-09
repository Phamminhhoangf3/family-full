import axios from "axios";
import { DetailFamilyType, ListFamilyType } from "@/types/family";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL + "/v1/",
  headers: {
    "Content-type": "application/json",
  },
});

export const getDetailFamily = async (params: DetailFamilyType) => {
  const response = await api.get(`web/family/view/${params?.id}`);
  return response.data;
};

export const getListFamily = async (params: ListFamilyType) => {
  const response = await api.post("families/getList", params);
  return response.data;
};

export const getListFamily = async (params: ListFamilyType) => {
  const response = await api.post("families/getList", params);
  return response.data;
};
