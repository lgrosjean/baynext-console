interface Dataset {
  id: string
  name: string
  description: string
  size: number
  format: string
  uploadedAt: string
  status: "ready" | "processing" | "error"
  rows?: number
  columns?: number
}

export type { Dataset }