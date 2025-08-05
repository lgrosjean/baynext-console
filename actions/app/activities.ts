"use server"
import { Activity } from "@/types/activity"

const recentActivity: Activity[] = [
    {
      id: "1",
      type: "dataset",
      title: "Media Spend Data uploaded",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: "completed",
    },
    {
      id: "2",
      type: "training",
      title: "MMM Model v2 training started",
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: "running",
    },
    {
      id: "3",
      type: "model",
      title: "MMM Model v1 deployed",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: "completed",
    },
    {
      id: "4",
      type: "dashboard",
      title: "Performance dashboard updated",
      time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      status: "completed",
    },
  ]

export async function getRecentActivity(): Promise<Activity[]> {
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return recentActivity;
}