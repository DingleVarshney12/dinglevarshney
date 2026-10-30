import { apiClient } from "../api-client";
import type { Project, ProjectInput, ProjectQuery, UpdateProjectInput } from "./project.type";

export function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  const suffix = params.size ? `?${params.toString()}` : "";
  return apiClient.get<Project[]>(`/projects${suffix}`);
}

export function getProjectBySlug(slug: string): Promise<Project> {
  return apiClient.get<Project>(`/projects/${encodeURIComponent(slug)}`);
}

export function getAdminProjects(accessToken: string): Promise<Project[]> {
  return apiClient.get<Project[]>("/admin/projects", accessToken);
}

export function createProject(input: ProjectInput, accessToken: string): Promise<Project> {
  return apiClient.post<ProjectInput, Project>("/admin/projects", input, accessToken);
}

export function updateProject(
  id: string,
  input: UpdateProjectInput,
  accessToken: string,
): Promise<Project> {
  return apiClient.patch<UpdateProjectInput, Project>(`/admin/projects/${id}`, input, accessToken);
}

export function deleteProject(id: string, accessToken: string): Promise<void> {
  return apiClient.delete<void>(`/admin/projects/${id}`, accessToken);
}
