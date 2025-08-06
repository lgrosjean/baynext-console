"use server"

import { createClient } from "@/lib/supabase/server"
import { ApiKey, ApiKeyCreate } from "@/types/api-keys.types"
import { revalidatePath } from "next/cache";


export async function getApiKeys(userId: string): Promise<ApiKey[]> {
  const supabase = await createClient();
  const { data: apiKeys, error } = await supabase
    .from('apiKey')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching API keys:", error);
    throw new Error("Failed to fetch API keys");
  }

  return apiKeys;
}

export async function createApiKey(apiKey: ApiKeyCreate, userId: string): Promise<ApiKey> {
  console.log(`Creating API Key for User ID: ${userId}`, apiKey.name)

  const supabase = await createClient();
  const { data: createdApiKey, error } = await supabase
    .from('apiKey')
    .insert(apiKey)
    .select()
    .single();

  if (error) {
    console.error("Error creating API key:", error);
    console.error(apiKey);
    throw new Error("Failed to create API key");
  }

  revalidatePath('/app/settings');
  console.log(`API Key created successfully: ${createdApiKey.id} for User ID: ${userId}`);

  return createdApiKey;
}

export async function updateApiKeyStatus(apiKey: ApiKey, userId: string): Promise<void> {
  console.log(`Updating API Key status for ID: ${apiKey.id}, User ID: ${userId}`)

  const supabase = await createClient();
  const { error } = await supabase
    .from('apiKey')
    .update({ enabled: !apiKey.enabled })
    .eq('id', apiKey.id)

  if (error) {
    console.error("Error updating API key status:", error);
    throw new Error("Failed to update API key status");
  }

  apiKey.enabled = !apiKey.enabled; // Toggle the status in the local object

  revalidatePath('/app/settings');
  console.log(`API Key ${apiKey.id} status updated to ${apiKey.enabled ? 'enabled' : 'disabled'}`);
}

export async function deleteApiKey(apiKeyId: string, userId: string): Promise<void> {
  console.log(`Deleting API Key with ID: ${apiKeyId}, User ID: ${userId}`)
  const supabase = await createClient();
  const { error } = await supabase
    .from('apiKey')
    .delete()
    .eq('id', apiKeyId)
    .eq('user_id', userId);

  if (error) {
    console.error("Error deleting API key:", error);
    throw new Error("Failed to delete API key");
  }

  revalidatePath('/app/settings');
  console.log(`API Key ${apiKeyId} deleted successfully`);
}