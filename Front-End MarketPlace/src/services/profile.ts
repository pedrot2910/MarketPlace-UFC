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

export async function getProfileImage(profileId: string) {
  const response = await api.get(`/profiles/${profileId}/image`);
  return response.data;
}

export async function uploadProfileImage(profileId: string, imageUrl: string) {
  const response = await api.post(`/profiles/${profileId}/image`, { imageUrl });
  return response.data;
}

export async function updateProfileImage(profileId: string, imageUrl: string) {
  const response = await api.put(`/profiles/${profileId}/image`, { imageUrl });
  return response.data;
}

export async function deleteProfileImage(profileId: string) {
  const response = await api.delete(`/profiles/${profileId}/image`);
  return response.data;
}
