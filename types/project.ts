import { Database } from "./database.types";

export type ProjectStatus = Database["public"]["Enums"]["projectStatus"]
export type ProjectTier = Database["public"]["Enums"]["tier"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectCreate = Database["public"]["Tables"]["projects"]["Insert"];

export type ProjectWithCount = Database["public"]["Tables"]["projects"]["Row"] & {
  datasets: number
  models: number
  jobs: number // monthly jobs
  dashboards: number
  scenarios: number
  members: number
}

interface Quota {
  used: number
  limit: number
}

export type ProjectWithQuota = Omit<ProjectWithCount, "datasets" | "models" | "jobs" | "dashboards" | "scenarios" | "members"> & {
  datasets: Quota
  models: Quota
  jobs: Quota
  dashboards: Quota
  scenarios: Quota
  members: Quota
  totalSpend: number // Monthly spend
  roi: number // Return on investment
};
