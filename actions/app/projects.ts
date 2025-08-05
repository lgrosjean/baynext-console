"use server"
import { generateSlug } from "@/lib/utils"
import { ProjectStats } from "@/types/project"

import { ProjectTier, Project, ProjectDetails, ProjectCreate } from "@/types/project"

const limits: Record<ProjectTier, { 
    datasets: number
    models: number
    members: number
    jobs: number
    dashboards: number
    scenarios: number
}> = {
    "free": {
        datasets: 5,
        models: 3,
        members: 10,
        jobs: 50,
        dashboards: 3,
        scenarios: 2,
    },
    "pro": {
        datasets: 10,
        models: 5,
        members: 20,
        jobs: 100,
        dashboards: 5,
        scenarios: 5,
    }
}

const projects: ProjectDetails[] = [
    {
        id: "1",
        name: "Q4 Campaign Analysis",
        description: "Mix marketing model for Q4 holiday campaigns across digital and traditional channels",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        status: "deployed",
        userId: "user123",
        slug: generateSlug(),
        datasets: 3,
        models: 2,
        members: 5,
        tier: "free",
    },
    {
        id: "2",
        name: "Brand Awareness Study",
        description: "Attribution modeling for brand awareness campaigns with focus on upper-funnel metrics",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-12"),
        status: 'archived',
        userId: "user123",
        slug: generateSlug(),
        datasets: 2,
        models: 1,
        members: 4,
        tier: "pro",
    },
    {
        id: "3",
        name: "Multi-Channel Attribution",
        description: "Cross-channel attribution analysis for integrated marketing campaigns",
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-09"),
        status: "draft",
        userId: "user123",
        slug: generateSlug(),
        datasets: 4,
        models: 3,
        members: 6,
        tier: "free",
    },
    {
        id: "4",
        name: "Social Media ROI Analysis",
        description: "Comprehensive analysis of social media campaign performance and attribution",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-07"),
        status: "deployed",
        userId: "user123",
        slug: generateSlug(),
        datasets: 5,
        models: 4,
        members: 7,
        tier: "pro",
    },
    {
        id: "5",
        name: "Email Marketing Attribution",
        description: "Email campaign attribution modeling with customer journey mapping",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-04"),
        status: 'deployed',
        userId: "user123",
        slug: generateSlug(),
        datasets: 2,
        models: 1,
        members: 3,
        tier: "free",
    },
    {
        id: "6",
        name: "Cross-Platform Analytics",
        description: "Unified analytics across web, mobile, and offline touchpoints",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        status: "draft",
        userId: "user123",
        slug: generateSlug(),
        datasets: 3,
        models: 2,
        members: 5,
        tier: "pro",
    },
]

export async function getProjects(userId: string): Promise<Project[]> {
    // Simulate fetching projects from a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    return projects.filter(project => project.userId === userId);
}

/**
 * Fetch project details for a specific user
 * @param userId - The ID of the user
 * @returns The projects' details for the user or null if not found
 */
export async function getProjectsDetails(userId: string): Promise<ProjectDetails[]> {
    // Simulate fetching project details from a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))

    return projects.filter(project => project.userId === userId);
}

export async function getProjectStats(projectSlug: string): Promise<ProjectStats> {
    // Simulate fetching project stats from a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const project = projects.find(p => p.slug === projectSlug);
    if (!project) {
        throw new Error(`Project with slug ${projectSlug} not found`);
    }

    const tierLimits = limits[project.tier];

    const projectStats: ProjectStats = {
        ...project,
        datasets: {
            used: project.datasets,
            limit: tierLimits.datasets,
        },
        models: {
            used: project.models,   
            limit: tierLimits.models,
        },
        jobs: {
            used: 10, // Example value, replace with actual logic
            limit: tierLimits.jobs,
        },
        dashboards: {
            used: 5, // Example value, replace with actual logic    
            limit: tierLimits.dashboards,
        },
        scenarios: {
            used: 2, // Example value, replace with actual logic
            limit: tierLimits.scenarios,
        },
        members: {
            used: project.members,
            limit: tierLimits.members,
        },
        totalSpend: 1000, // Example value, replace with actual logic
        roi: 150, // Example value, replace with actual logic
    };

    return projectStats;
}

export async function createProject(project: ProjectCreate): Promise<Project> {
    // Simulate creating a project in a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Here you would typically save the project to a database and return the saved project
    return {
        ...project,
        id: `${projects.length + 1}`, // Simple ID generation
        createdAt: new Date(),
        slug: project.name.toLowerCase().replace(/\s+/g, "-"),
        status: "draft",
        tier: "free",
    }
}