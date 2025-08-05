"use server"

import { formatDistanceToNow } from 'date-fns';
import { ProjectStats } from "@/types/project"

export async function getProjectStats(projectSlug: string): Promise<ProjectStats> {
    // Simulate fetching project stats from a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const lastUpdated = new Date();
    const formattedLastUpdated = formatDistanceToNow(lastUpdated, { addSuffix: true });

    return {
        datasets: { current: 5, max: 10 },
        models: { current: 3, max: 5 },
        monthlyJobs: { current: 20, max: 50 },
        dashboards: { current: 2, max: 5 },
        totalSpend: 15000,
        roi: 1.5,
        lastUpdated: formattedLastUpdated,
    }
}