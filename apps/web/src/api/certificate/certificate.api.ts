import { apiClient } from "../api-client";
import type { Certificate, CertificateInput, UpdateCertificateInput } from "./certificate.type";

export function getCertificates(): Promise<Certificate[]> {
  return apiClient.get<Certificate[]>("/certificates");
}

export function getAdminCertificates(accessToken: string): Promise<Certificate[]> {
  return apiClient.get<Certificate[]>("/admin/certificates", accessToken);
}

export function createCertificate(
  input: CertificateInput,
  accessToken: string,
): Promise<Certificate> {
  return apiClient.post<CertificateInput, Certificate>("/admin/certificates", input, accessToken);
}

export function updateCertificate(
  id: string,
  input: UpdateCertificateInput,
  accessToken: string,
): Promise<Certificate> {
  return apiClient.patch<UpdateCertificateInput, Certificate>(
    `/admin/certificates/${id}`,
    input,
    accessToken,
  );
}

export function deleteCertificate(id: string, accessToken: string): Promise<void> {
  return apiClient.delete<void>(`/admin/certificates/${id}`, accessToken);
}
