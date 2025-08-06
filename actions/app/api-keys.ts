"use server"

import { ApiKey, ApiKeyCreate } from "@/types/api-keys.types"
import { revalidatePath } from "next/cache";

const apiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    userId: "user_123",
    key: "sk_live_1234567890abcdef1234567890abcdef",
    permissions: null,
    expiresAt: null,
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date("2024-01-20"),
    enabled: true,
  },
  {
    id: "2",
    userId: "user_123",
    name: "Development Key",
    key: "sk_test_abcdef1234567890abcdef1234567890",
    permissions: "1,2",
    expiresAt: new Date("2024-06-15"),
    createdAt: new Date("2024-01-10"),
    lastUsed: new Date("2024-01-19"),
    enabled: true,
  },
  {
    id: "3",
    userId: "user_123",
    name: "Analytics Dashboard",
    key: "sk_live_fedcba0987654321fedcba0987654321",
    permissions: null,
    expiresAt: new Date("2024-03-15"),
    createdAt: new Date("2024-01-05"),
    lastUsed: null,
    enabled: false,
  },
]

export async function getApiKeys(userId: string): Promise<ApiKey[]> {
  // Simulate fetching from a database
  return apiKeys.filter(key => key.userId === userId);
}

export async function createApiKey(apiKey: ApiKeyCreate, userId: string): Promise<ApiKey> {
  // Simulate creating an API key
  // TODO: bcrypt the key before storing it

  const newApiKey: ApiKey = {
    ...apiKey,
    id: Date.now().toString(),
    userId: userId,
    lastUsed: null,
    createdAt: new Date(),
    enabled: true,
  }

  console.log(`Creating API Key for User ID: ${userId}`, newApiKey.name)

  apiKeys.push(newApiKey)
  revalidatePath(`/app/settings`)
  return newApiKey
}

export async function updateApiKeyStatus(apiKey: ApiKey, userId: string): Promise<ApiKey> {
  // Simulate updating an API key's status
  console.log(`Updating API Key status for ID: ${apiKey.id}, User ID: ${userId}`)
  const index = apiKeys.findIndex(key => key.id === apiKey.id && key.userId === userId);
  if (index !== -1) {
    apiKeys[index] = { ...apiKeys[index], enabled: !apiKeys[index].enabled };
    console.log(`API Key with ID ${apiKey.id} updated to ${apiKeys[index].enabled ? "active" : "inactive"}`);
    revalidatePath(`/app/settings`)
    return apiKeys[index];
  }
  throw new Error("API Key not found or does not belong to user");
}

export async function deleteApiKey(apiKeyId: string, userId: string): Promise<void> {
  // Simulate deleting an API key
  const index = apiKeys.findIndex(key => key.id === apiKeyId && key.userId === userId);
  if (index !== -1) {
    apiKeys.splice(index, 1);
    revalidatePath(`/app/settings`)
  }

  console.log(`API Key with ID ${apiKeyId} deleted!`);
}