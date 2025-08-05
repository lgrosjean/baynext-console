interface ProjectStats {
  datasets: { current: number; max: number }
  models: { current: number; max: number }
  monthlyJobs: { current: number; max: number }
  dashboards: { current: number; max: number }
  totalSpend: number
  roi: number
  lastUpdated: string
}

export type { ProjectStats }