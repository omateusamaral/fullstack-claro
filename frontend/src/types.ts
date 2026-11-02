export enum TaskStatus {
  PENDING = "pendente",
  IN_PROGRESS = "em progresso",
  COMPLETED = "concluído",
}
export const COLORS_BY_STATUS: Record<TaskStatus, string> = {
  [TaskStatus.COMPLETED]: "#16A34A",
  [TaskStatus.IN_PROGRESS]: "#F59E0B",
  [TaskStatus.PENDING]: "#9CA3AF",
};
export type Team = {
  id: string;
  name: string;
  colorHex: string;
  description?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  teams: Team[];
};

export type Paginated<T> = {
  tasks?: T[];
  teams?: T[];
  limit: number;
  offset: number;
  total: number;
};
