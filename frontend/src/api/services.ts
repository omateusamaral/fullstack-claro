import { api } from "./client";
import { Paginated, Task, TaskStatus, Team } from "../types";

export async function fetchTeams(search?: string): Promise<Team[]> {
  const { data } = await api.get<Paginated<Team>>("/teams", {
    params: { limit: 100, offset: 0, ...(search ? { search } : {}) },
  });
  return data.teams ?? [];
}

export type TeamInput = {
  name: string;
  colorHex: string;
  description?: string;
};

export async function createTeam(input: TeamInput): Promise<Team> {
  const { data } = await api.post<Team>("/teams", input);
  return data;
}

export async function updateTeam(
  teamId: string,
  input: Partial<TeamInput>,
): Promise<Team> {
  const { data } = await api.put<Team>(`/teams/${teamId}`, input);
  return data;
}

export async function deleteTeam(teamId: string): Promise<void> {
  await api.delete(`/teams/${teamId}`);
}

export type TaskFilters = {
  search?: string;
  status?: TaskStatus;
  limit?: number;
  offset?: number;
  order?: "ASC" | "DESC";
};

export async function fetchTasks(
  teamId?: string,
  filters: TaskFilters = {},
): Promise<Paginated<Task>> {
  const params = {
    limit: filters.limit ?? 10,
    offset: filters.offset ?? 0,
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.order ? { order: filters.order } : {}),
    ...(teamId ? { teamId } : {}),
  };

  const { data } = await api.get<Paginated<Task>>("/tasks", {
    params,
  });
  return data;
}

export async function fetchTask(taskId: string): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${taskId}`);
  return data;
}

export type TaskInput = {
  title: string;
  description?: string;
  teamIds?: string[];
  dueDate?: string;
  status?: TaskStatus;
};

export async function createTask(input: TaskInput): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", input);
  return data;
}

export async function updateTask(
  taskId: string,
  input: Partial<TaskInput>,
): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${taskId}`, input);
  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}
