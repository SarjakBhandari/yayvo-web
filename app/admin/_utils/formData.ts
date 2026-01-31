// admin/utils/formData.ts
export function buildConsumerFormData(payload: Record<string, any>) {
  const fd = new FormData();
  fd.append("email", payload.email ?? "");
  fd.append("password", payload.password ?? "");
  fd.append("fullName", payload.fullName ?? "");
  fd.append("username", payload.username ?? "");
  fd.append("phoneNumber", payload.phoneNumber ?? "");
  fd.append("dob", payload.dob ?? "");
  fd.append("gender", payload.gender ?? "");
  fd.append("country", payload.country ?? "");
  if (payload.profilePicture instanceof File) fd.append("profilePicture", payload.profilePicture);
  return fd;
}

export function buildRetailerFormData(payload: Record<string, any>) {
  const fd = new FormData();
  fd.append("email", payload.email ?? "");
  fd.append("password", payload.password ?? "");
  fd.append("ownerName", payload.ownerName ?? "");
  fd.append("organizationName", payload.organizationName ?? "");
  fd.append("username", payload.username ?? "");
  fd.append("phoneNumber", payload.phoneNumber ?? "");
  fd.append("dateOfEstablishment", payload.dateOfEstablishment ?? "");
  fd.append("country", payload.country ?? "");
  if (payload.profilePicture instanceof File) fd.append("profilePicture", payload.profilePicture);
  return fd;
}
