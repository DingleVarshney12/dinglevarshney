export type PortfolioImageFolder = "profile" | "projects" | "certificates" | "about";

export interface UploadPortfolioImageInput {
  file: File;
  folder: PortfolioImageFolder;
}
