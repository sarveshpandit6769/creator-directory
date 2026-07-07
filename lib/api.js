import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001",
});

export async function fetchCreators(params) {
  // Remove empty values before sending
  const clean = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v != null)
  );
  const { data } = await api.get("/creators", { params: clean });
  return data;
}

export async function createCreator(body) {
  const { data } = await api.post("/creators", body);
  return data;
}

export async function updateCreator({ id, ...body }) {
  const { data } = await api.patch(`/creators/${id}`, body);
  return data;
}

export async function deleteCreator(id) {
  await api.delete(`/creators/${id}`);
}