import api from "./api";

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
};

export async function fetchProfileById(profileId: string) {
  const response = await api.get(`/profiles/${profileId}`);
  return response.data;
}

export async function updateProfile(
  profileId: string,
  payload: UpdateProfilePayload
) {
  const response = await api.put(`/profiles/${profileId}`, payload);
  return response.data;
}
