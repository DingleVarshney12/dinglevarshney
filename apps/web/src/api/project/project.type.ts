export type { Project } from "@/lib/types";
import type { Project } from "@/lib/types";

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProjectInput = Partial<ProjectInput>;

export interface ProjectQuery {
  category?: string;
}
