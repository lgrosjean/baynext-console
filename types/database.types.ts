export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      apiKey: {
        Row: {
          createdAt: string
          enabled: boolean
          expiresAt: string | null
          id: string
          key: string
          lastUsed: string | null
          name: string
          permissions: string | null
          start: string | null
          user_id: string
        }
        Insert: {
          createdAt?: string
          enabled?: boolean
          expiresAt?: string | null
          id?: string
          key: string
          lastUsed?: string | null
          name: string
          permissions?: string | null
          start?: string | null
          user_id: string
        }
        Update: {
          createdAt?: string
          enabled?: boolean
          expiresAt?: string | null
          id?: string
          key?: string
          lastUsed?: string | null
          name?: string
          permissions?: string | null
          start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          assessment_id: string
          assessment_metadata: string | null
          assessment_type: string
          created_timestamp: number
          error: string | null
          last_updated_timestamp: number
          name: string
          overrides: string | null
          rationale: string | null
          run_id: string | null
          source_id: string | null
          source_type: string
          span_id: string | null
          trace_id: string
          valid: boolean
          value: string
        }
        Insert: {
          assessment_id: string
          assessment_metadata?: string | null
          assessment_type: string
          created_timestamp: number
          error?: string | null
          last_updated_timestamp: number
          name: string
          overrides?: string | null
          rationale?: string | null
          run_id?: string | null
          source_id?: string | null
          source_type: string
          span_id?: string | null
          trace_id: string
          valid: boolean
          value: string
        }
        Update: {
          assessment_id?: string
          assessment_metadata?: string | null
          assessment_type?: string
          created_timestamp?: number
          error?: string | null
          last_updated_timestamp?: number
          name?: string
          overrides?: string | null
          rationale?: string | null
          run_id?: string | null
          source_id?: string | null
          source_type?: string
          span_id?: string | null
          trace_id?: string
          valid?: boolean
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_assessments_trace_id"
            columns: ["trace_id"]
            isOneToOne: false
            referencedRelation: "trace_info"
            referencedColumns: ["request_id"]
          },
        ]
      }
      dataset_media_channels: {
        Row: {
          channel_name: string
          created_at: string | null
          dataset_id: string | null
          frequency_column: string | null
          id: string
          media_column: string | null
          reach_column: string | null
          rf_spend_column: string | null
          spend_column: string | null
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          dataset_id?: string | null
          frequency_column?: string | null
          id?: string
          media_column?: string | null
          reach_column?: string | null
          rf_spend_column?: string | null
          spend_column?: string | null
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          dataset_id?: string | null
          frequency_column?: string | null
          id?: string
          media_column?: string | null
          reach_column?: string | null
          rf_spend_column?: string | null
          spend_column?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dataset_media_channels_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasources"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          dataset_profile: string | null
          dataset_schema: string | null
          dataset_source: string
          dataset_source_type: string
          dataset_uuid: string
          digest: string
          experiment_id: number
          name: string
        }
        Insert: {
          dataset_profile?: string | null
          dataset_schema?: string | null
          dataset_source: string
          dataset_source_type: string
          dataset_uuid: string
          digest: string
          experiment_id: number
          name: string
        }
        Update: {
          dataset_profile?: string | null
          dataset_schema?: string | null
          dataset_source?: string
          dataset_source_type?: string
          dataset_uuid?: string
          digest?: string
          experiment_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_datasets_experiment_id_experiments"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
        ]
      }
      datasources: {
        Row: {
          control_columns: string[] | null
          created_at: string
          description: string | null
          file_path: string | null
          file_size: number | null
          geo_column: string | null
          id: string
          kpi_column: string
          kpi_type: Database["public"]["Enums"]["kpiType"] | null
          name: string
          population_column: string | null
          project_id: string
          revenue_per_kpi_column: string | null
          time_column: string
          treatment_columns: string[] | null
          updated_at: string
        }
        Insert: {
          control_columns?: string[] | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          geo_column?: string | null
          id?: string
          kpi_column: string
          kpi_type?: Database["public"]["Enums"]["kpiType"] | null
          name: string
          population_column?: string | null
          project_id: string
          revenue_per_kpi_column?: string | null
          time_column: string
          treatment_columns?: string[] | null
          updated_at?: string
        }
        Update: {
          control_columns?: string[] | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          geo_column?: string | null
          id?: string
          kpi_column?: string
          kpi_type?: Database["public"]["Enums"]["kpiType"] | null
          name?: string
          population_column?: string | null
          project_id?: string
          revenue_per_kpi_column?: string | null
          time_column?: string
          treatment_columns?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "datasets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_tags: {
        Row: {
          experiment_id: number
          key: string
          value: string | null
        }
        Insert: {
          experiment_id: number
          key: string
          value?: string | null
        }
        Update: {
          experiment_id?: number
          key?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiment_tags_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
        ]
      }
      experiments: {
        Row: {
          artifact_location: string | null
          creation_time: number | null
          experiment_id: number
          last_update_time: number | null
          lifecycle_stage: string | null
          name: string
        }
        Insert: {
          artifact_location?: string | null
          creation_time?: number | null
          experiment_id?: number
          last_update_time?: number | null
          lifecycle_stage?: string | null
          name: string
        }
        Update: {
          artifact_location?: string | null
          creation_time?: number | null
          experiment_id?: number
          last_update_time?: number | null
          lifecycle_stage?: string | null
          name?: string
        }
        Relationships: []
      }
      input_tags: {
        Row: {
          input_uuid: string
          name: string
          value: string
        }
        Insert: {
          input_uuid: string
          name: string
          value: string
        }
        Update: {
          input_uuid?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      inputs: {
        Row: {
          destination_id: string
          destination_type: string
          input_uuid: string
          source_id: string
          source_type: string
          step: number
        }
        Insert: {
          destination_id: string
          destination_type: string
          input_uuid: string
          source_id: string
          source_type: string
          step?: number
        }
        Update: {
          destination_id?: string
          destination_type?: string
          input_uuid?: string
          source_id?: string
          source_type?: string
          step?: number
        }
        Relationships: []
      }
      latest_metrics: {
        Row: {
          is_nan: boolean
          key: string
          run_uuid: string
          step: number
          timestamp: number | null
          value: number
        }
        Insert: {
          is_nan: boolean
          key: string
          run_uuid: string
          step: number
          timestamp?: number | null
          value: number
        }
        Update: {
          is_nan?: boolean
          key?: string
          run_uuid?: string
          step?: number
          timestamp?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "latest_metrics_run_uuid_fkey"
            columns: ["run_uuid"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_uuid"]
          },
        ]
      }
      logged_model_metrics: {
        Row: {
          dataset_digest: string | null
          dataset_name: string | null
          dataset_uuid: string | null
          experiment_id: number
          metric_name: string
          metric_step: number
          metric_timestamp_ms: number
          metric_value: number | null
          model_id: string
          run_id: string
        }
        Insert: {
          dataset_digest?: string | null
          dataset_name?: string | null
          dataset_uuid?: string | null
          experiment_id: number
          metric_name: string
          metric_step: number
          metric_timestamp_ms: number
          metric_value?: number | null
          model_id: string
          run_id: string
        }
        Update: {
          dataset_digest?: string | null
          dataset_name?: string | null
          dataset_uuid?: string | null
          experiment_id?: number
          metric_name?: string
          metric_step?: number
          metric_timestamp_ms?: number
          metric_value?: number | null
          model_id?: string
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_logged_model_metrics_experiment_id"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
          {
            foreignKeyName: "fk_logged_model_metrics_model_id"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "logged_models"
            referencedColumns: ["model_id"]
          },
          {
            foreignKeyName: "fk_logged_model_metrics_run_id"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_uuid"]
          },
        ]
      }
      logged_model_params: {
        Row: {
          experiment_id: number
          model_id: string
          param_key: string
          param_value: string
        }
        Insert: {
          experiment_id: number
          model_id: string
          param_key: string
          param_value: string
        }
        Update: {
          experiment_id?: number
          model_id?: string
          param_key?: string
          param_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_logged_model_params_experiment_id"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
          {
            foreignKeyName: "fk_logged_model_params_model_id"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "logged_models"
            referencedColumns: ["model_id"]
          },
        ]
      }
      logged_model_tags: {
        Row: {
          experiment_id: number
          model_id: string
          tag_key: string
          tag_value: string
        }
        Insert: {
          experiment_id: number
          model_id: string
          tag_key: string
          tag_value: string
        }
        Update: {
          experiment_id?: number
          model_id?: string
          tag_key?: string
          tag_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_logged_model_tags_experiment_id"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
          {
            foreignKeyName: "fk_logged_model_tags_model_id"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "logged_models"
            referencedColumns: ["model_id"]
          },
        ]
      }
      logged_models: {
        Row: {
          artifact_location: string
          creation_timestamp_ms: number
          experiment_id: number
          last_updated_timestamp_ms: number
          lifecycle_stage: string | null
          model_id: string
          model_type: string | null
          name: string
          source_run_id: string | null
          status: number
          status_message: string | null
        }
        Insert: {
          artifact_location: string
          creation_timestamp_ms: number
          experiment_id: number
          last_updated_timestamp_ms: number
          lifecycle_stage?: string | null
          model_id: string
          model_type?: string | null
          name: string
          source_run_id?: string | null
          status: number
          status_message?: string | null
        }
        Update: {
          artifact_location?: string
          creation_timestamp_ms?: number
          experiment_id?: number
          last_updated_timestamp_ms?: number
          lifecycle_stage?: string | null
          model_id?: string
          model_type?: string | null
          name?: string
          source_run_id?: string | null
          status?: number
          status_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_logged_models_experiment_id"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
        ]
      }
      metrics: {
        Row: {
          is_nan: boolean
          key: string
          run_uuid: string
          step: number
          timestamp: number
          value: number
        }
        Insert: {
          is_nan?: boolean
          key: string
          run_uuid: string
          step?: number
          timestamp: number
          value: number
        }
        Update: {
          is_nan?: boolean
          key?: string
          run_uuid?: string
          step?: number
          timestamp?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_run_uuid_fkey"
            columns: ["run_uuid"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_uuid"]
          },
        ]
      }
      model_version_tags: {
        Row: {
          key: string
          name: string
          value: string | null
          version: number
        }
        Insert: {
          key: string
          name: string
          value?: string | null
          version: number
        }
        Update: {
          key?: string
          name?: string
          value?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_version_tags_name_version_fkey"
            columns: ["name", "version"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["name", "version"]
          },
        ]
      }
      model_versions: {
        Row: {
          creation_time: number | null
          current_stage: string | null
          description: string | null
          last_updated_time: number | null
          name: string
          run_id: string | null
          run_link: string | null
          source: string | null
          status: string | null
          status_message: string | null
          storage_location: string | null
          user_id: string | null
          version: number
        }
        Insert: {
          creation_time?: number | null
          current_stage?: string | null
          description?: string | null
          last_updated_time?: number | null
          name: string
          run_id?: string | null
          run_link?: string | null
          source?: string | null
          status?: string | null
          status_message?: string | null
          storage_location?: string | null
          user_id?: string | null
          version: number
        }
        Update: {
          creation_time?: number | null
          current_stage?: string | null
          description?: string | null
          last_updated_time?: number | null
          name?: string
          run_id?: string | null
          run_link?: string | null
          source?: string | null
          status?: string | null
          status_message?: string | null
          storage_location?: string | null
          user_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_versions_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "registered_models"
            referencedColumns: ["name"]
          },
        ]
      }
      models: {
        Row: {
          accuracy: number | null
          created_at: string | null
          deployed_at: string | null
          id: string
          name: string
          project_id: string
          status: string | null
          training_job_id: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          deployed_at?: string | null
          id?: string
          name: string
          project_id: string
          status?: string | null
          training_job_id?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          deployed_at?: string | null
          id?: string
          name?: string
          project_id?: string
          status?: string | null
          training_job_id?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_training_job_id_fkey"
            columns: ["training_job_id"]
            isOneToOne: false
            referencedRelation: "training_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      params: {
        Row: {
          key: string
          run_uuid: string
          value: string
        }
        Insert: {
          key: string
          run_uuid: string
          value: string
        }
        Update: {
          key?: string
          run_uuid?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "params_run_uuid_fkey"
            columns: ["run_uuid"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_uuid"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["projectStatus"]
          updatedAt: string | null
          user_id: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["projectStatus"]
          updatedAt?: string | null
          user_id: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["projectStatus"]
          updatedAt?: string | null
          user_id?: string
        }
        Relationships: []
      }
      registered_model_aliases: {
        Row: {
          alias: string
          name: string
          version: number
        }
        Insert: {
          alias: string
          name: string
          version: number
        }
        Update: {
          alias?: string
          name?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "registered_model_alias_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "registered_models"
            referencedColumns: ["name"]
          },
        ]
      }
      registered_model_tags: {
        Row: {
          key: string
          name: string
          value: string | null
        }
        Insert: {
          key: string
          name: string
          value?: string | null
        }
        Update: {
          key?: string
          name?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registered_model_tags_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "registered_models"
            referencedColumns: ["name"]
          },
        ]
      }
      registered_models: {
        Row: {
          creation_time: number | null
          description: string | null
          last_updated_time: number | null
          name: string
        }
        Insert: {
          creation_time?: number | null
          description?: string | null
          last_updated_time?: number | null
          name: string
        }
        Update: {
          creation_time?: number | null
          description?: string | null
          last_updated_time?: number | null
          name?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          artifact_uri: string | null
          deleted_time: number | null
          end_time: number | null
          entry_point_name: string | null
          experiment_id: number | null
          lifecycle_stage: string | null
          name: string | null
          run_uuid: string
          source_name: string | null
          source_type: string | null
          source_version: string | null
          start_time: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          artifact_uri?: string | null
          deleted_time?: number | null
          end_time?: number | null
          entry_point_name?: string | null
          experiment_id?: number | null
          lifecycle_stage?: string | null
          name?: string | null
          run_uuid: string
          source_name?: string | null
          source_type?: string | null
          source_version?: string | null
          start_time?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          artifact_uri?: string | null
          deleted_time?: number | null
          end_time?: number | null
          entry_point_name?: string | null
          experiment_id?: number | null
          lifecycle_stage?: string | null
          name?: string | null
          run_uuid?: string
          source_name?: string | null
          source_type?: string | null
          source_version?: string | null
          start_time?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "runs_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
        ]
      }
      tags: {
        Row: {
          key: string
          run_uuid: string
          value: string | null
        }
        Insert: {
          key: string
          run_uuid: string
          value?: string | null
        }
        Update: {
          key?: string
          run_uuid?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_run_uuid_fkey"
            columns: ["run_uuid"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_uuid"]
          },
        ]
      }
      trace_info: {
        Row: {
          client_request_id: string | null
          execution_time_ms: number | null
          experiment_id: number
          request_id: string
          request_preview: string | null
          response_preview: string | null
          status: string
          timestamp_ms: number
        }
        Insert: {
          client_request_id?: string | null
          execution_time_ms?: number | null
          experiment_id: number
          request_id: string
          request_preview?: string | null
          response_preview?: string | null
          status: string
          timestamp_ms: number
        }
        Update: {
          client_request_id?: string | null
          execution_time_ms?: number | null
          experiment_id?: number
          request_id?: string
          request_preview?: string | null
          response_preview?: string | null
          status?: string
          timestamp_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_trace_info_experiment_id"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["experiment_id"]
          },
        ]
      }
      trace_request_metadata: {
        Row: {
          key: string
          request_id: string
          value: string | null
        }
        Insert: {
          key: string
          request_id: string
          value?: string | null
        }
        Update: {
          key?: string
          request_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trace_request_metadata_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "trace_info"
            referencedColumns: ["request_id"]
          },
        ]
      }
      trace_tags: {
        Row: {
          key: string
          request_id: string
          value: string | null
        }
        Insert: {
          key: string
          request_id: string
          value?: string | null
        }
        Update: {
          key?: string
          request_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trace_tags_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "trace_info"
            referencedColumns: ["request_id"]
          },
        ]
      }
      training_jobs: {
        Row: {
          accuracy: number | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          model_type: string
          name: string
          project_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          model_type: string
          name: string
          project_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          model_type?: string
          name?: string
          project_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      kpiType: "revenue" | "non-revenue"
      projectStatus: "draft" | "deployed" | "archived"
      tier: "public" | "pro" | "free"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kpiType: ["revenue", "non-revenue"],
      projectStatus: ["draft", "deployed", "archived"],
      tier: ["public", "pro", "free"],
    },
  },
} as const
