"use server"
import { generateSlug } from "@/lib/utils"

import { ProjectTier, Project, ProjectWithCount, ProjectCreate, ProjectWithQuota } from "@/types/project"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export async function getUserProjects(userId: string): Promise<Project[] | null> {

    const supabase = await createClient();
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', userId)

    if (error) {
        console.error("Error fetching projects:", error);
        return null;
    }

    return data;
}

export async function getProject(userId: string, projectSlug: string): Promise<Project | null> {

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('slug', projectSlug)
        .single() // Get a single project

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    return data || null;
}

export async function getProjectById({ userId, projectId} : {userId: string, projectId: string}): Promise<Project | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')    
        .eq('user_id', userId)
        .eq('id', projectId)
        .single();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    return data || null;
}

/**
 * Fetch project details for a specific user
 * @param userId - The ID of the user
 * @returns The projects' details for the user or null if not found
 */
export async function getProjectsWithCount(userId: string): Promise<ProjectWithCount[]> {
    const projects = await getUserProjects(userId);
    if (!projects) return [];

    return projects.map(project => ({
        ...project,
        datasets: Math.floor(Math.random() * 10), // Simulate datasets count
        models: Math.floor(Math.random() * 5), // Simulate models count
        members: Math.floor(Math.random() * 20), // Simulate members count
        jobs: Math.floor(Math.random() * 50), // Simulate jobs count
        dashboards: Math.floor(Math.random() * 5), // Simulate dashboards count
        scenarios: Math.floor(Math.random() * 3), // Simulate scenarios count
    }));
}

export async function getProjectWithCount(userId: string, projectSlug: string): Promise<ProjectWithCount | null> {

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('slug', projectSlug)

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    if (!data || data.length === 0) {
        console.warn(`Project with slug ${projectSlug} not found for user ${userId}`);
        return null;
    }

    const project = data[0];

    return {
        ...project,
        datasets: Math.floor(Math.random() * 10), // Simulate datasets count
        models: Math.floor(Math.random() * 5), // Simulate models count
        members: Math.floor(Math.random() * 20), // Simulate members count
        jobs: Math.floor(Math.random() * 50), // Simulate jobs count
        dashboards: Math.floor(Math.random() * 5), // Simulate dashboards count
        scenarios: Math.floor(Math.random() * 3), // Simulate scenarios count
    }
}

export async function getProjectWithQuota(userId: string, projectSlug: string): Promise<ProjectWithQuota> {
    // Simulate fetching project stats from a database or API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const projectDetails = await getProjectWithCount(userId, projectSlug);

    if (!projectDetails) {
        throw new Error(`Project with slug ${projectSlug} not found for user ${userId}`);
    }

    const projectWithQuota: ProjectWithQuota = {
        ...projectDetails,
        datasets: {
            used: projectDetails.datasets,
            limit: limits[projectDetails.tier].datasets,
        },
        models: {
            used: projectDetails.models,
            limit: limits[projectDetails.tier].models,
        },
        jobs: {
            used: projectDetails.jobs,
            limit: limits[projectDetails.tier].jobs,
        },
        dashboards: {
            used: projectDetails.dashboards,
            limit: limits[projectDetails.tier].dashboards,
        },
        scenarios: {
            used: projectDetails.scenarios,
            limit: limits[projectDetails.tier].scenarios,
        },
        members: {
            used: projectDetails.members,
            limit: limits[projectDetails.tier].members,
        },
        totalSpend: 1000, // Example value, replace with actual logic
        roi: 150, // Example value, replace with actual logic
    };

    return projectWithQuota;
}


export async function createProject(project: Omit<ProjectCreate, 'slug'> ): Promise<void> {
    const supabase = await createClient();

    const slug = generateSlug();
    const { error } = await supabase
        .from('projects')
        .insert({
            ...project,
            user_id: project.user_id, // Ensure user_id is set
            slug: slug, // Use the generated slug
        })

    if (error) {
        console.error("Error creating project:", error);
        throw error;
    }

    revalidatePath(`/app/projects`);
    redirect(`/app/projects/${slug}`);
}