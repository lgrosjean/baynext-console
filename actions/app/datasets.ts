"use server"

import { Dataset } from "@/types/dataset"

const datasets: Dataset[] = [
    {
        id: "1",
        name: "Media Spend Data",
        description: "Historical media spend across all channels including TV, Digital, Radio, and Print advertising",
        size: 2300,
        format: "CSV",
        uploadedAt: "2024-01-15",
        status: "ready",
        rows: 52000,
        columns: 12,
    },
    {
        id: "2",
        name: "Sales Performance",
        description: "Weekly sales data with regional breakdown and product categories",
        size: 1800,
        format: "CSV",
        uploadedAt: "2024-01-14",
        status: "ready",
        rows: 2600,
        columns: 8,
    },
    {
        id: "3",
        name: "External Factors",
        description: "Weather, holidays, and economic indicators that may impact sales",
        size: 500,
        format: "JSON",
        uploadedAt: "2024-01-13",
        status: "processing",
        rows: 1200,
        columns: 15,
    },
]

export async function getDatasets(): Promise<Dataset[]> {
    // Simulate a delay to mimic real data fetching
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Return the mock datasets
    return datasets
}

export async function createDataset(dataset: Dataset): Promise<Dataset> {
    // Simulate a delay to mimic real data creation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Assign a new ID and return the dataset
    const newDataset = { ...dataset, id: (datasets.length + 1).toString() }
    datasets.push(newDataset)
    return newDataset
}

export async function countDatasets(): Promise<number> {
    // Simulate a delay to mimic real data counting
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Return the count of datasets
    return datasets.length
}