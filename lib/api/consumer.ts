// lib/consumerApi.ts
import api from "./axios";
import { API } from "./endpoints";

export async function getConsumerById(id: string) {
  const { data } = await api.get(API.Consumer.CONSUMER_BY_ID.replace(":id", id));
  return data;
}

export async function getConsumerByAuthId(authId: string) {
  const { data } = await api.get(API.Consumer.CONSUMER_BY_AUTH.replace(":authId", authId));
  return data;
}


export async function updateConsumer(id: string, payload: Record<string, any>) {
  const { data } = await api.put(API.Consumer.CONSUMER_UPDATE.replace(":id", id), payload);
  return data;
}

export async function uploadConsumerPicture(id: string, file: File) {
  const fd = new FormData();
  fd.append("profilePicture", file);
  const { data } = await api.put(API.Consumer.CONSUMER_PICTURE.replace(":id", id), fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


