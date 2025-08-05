type ActivityType = "training" | "model" | "dataset" | "dashboard"

type ActivityStatus = "running" | "completed"

interface Activity {
    id: string
    type: ActivityType
    title: string
    time: Date
    status: ActivityStatus
}

export type { Activity, ActivityType }