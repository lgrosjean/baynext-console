import { Database } from "./database.types";

/**
 * API Key Type Definition
 * This type defines the structure of an API key object used in the application.
 * It includes fields for the key's ID, user association, name, hashed key, permissions,
 * expiration date, creation date, last used date, and whether the key is currently active.
 * 
 * Read more: https://www.better-auth.com/docs/plugins/api-key#schema
 */
export type ApiKey = Database['public']['Tables']['apiKey']['Row'];

/**
 * API Key Creation Type Definition
 * 
 * This type is used when creating a new API key, excluding fields that are automatically generated
 * such as ID, creation date, last used date, and active status.
 */
export type ApiKeyCreate = Database['public']['Tables']['apiKey']['Insert'];