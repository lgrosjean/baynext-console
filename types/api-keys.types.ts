/**
 * API Key Type Definition
 * This type defines the structure of an API key object used in the application.
 * It includes fields for the key's ID, user association, name, hashed key, permissions,
 * expiration date, creation date, last used date, and whether the key is currently active.
 * 
 * Read more: https://www.better-auth.com/docs/plugins/api-key#schema
 */
export type ApiKey = {
  id: string; // PK. The ID of the API key.
  userId: string; // FK. The ID of the user who created the API key.
  name: string; // The name of the API key.
  start?: string; // The starting characters of the API key. Useful for showing the first few characters of the API key in the UI for the users to easily identify.
  key: string; // The hashed API key itself.
  permissions: string | null; // The permissions of the key.
  expiresAt: Date | null; // ISO date string or null
  createdAt: Date; // ISO date string
  lastUsed: Date | null; // ISO date string or null
  enabled: boolean; // Indicates if the API key is currently active
};

/**
 * API Key Creation Type Definition
 * 
 * This type is used when creating a new API key, excluding fields that are automatically generated
 * such as ID, creation date, last used date, and active status.
 */
export type ApiKeyCreate = Omit<ApiKey, 'id' | 'createdAt' | 'lastUsed' | 'enabled'>;