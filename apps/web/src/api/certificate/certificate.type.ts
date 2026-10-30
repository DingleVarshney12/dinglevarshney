export type { Certificate } from "@/lib/types";
import type { Certificate } from "@/lib/types";

export type CertificateInput = Omit<Certificate, "id" | "createdAt" | "updatedAt">;
export type UpdateCertificateInput = Partial<CertificateInput>;
