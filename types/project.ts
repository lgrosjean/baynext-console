export type ProjectStatus = "draft"  | "deployed" | "archived";
export type ProjectTier = "free" | "pro";

export interface ProjectCreate {
  name: string
  description: string
  userId: string
}

interface Project extends ProjectCreate {
  id: string
  slug: string
  createdAt: Date
  updatedAt: Date
  status: ProjectStatus
  tier: ProjectTier
}

export interface ProjectDetails extends Project {
  datasets: number
  models: number
  members: number
}

interface Quota {
  used: number
  limit: number
}

interface ProjectStats extends Project {
  datasets: Quota
  models: Quota
  jobs: Quota // monthly jobs
  dashboards: Quota
  scenarios: Quota
  members: Quota
  totalSpend: number
  roi: number
}

export type { Project, ProjectStats }