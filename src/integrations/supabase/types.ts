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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      certifications: {
        Row: {
          id: string
          plant_slug: string
          system_id: string
          ultima: string
          vencimiento: string
        }
        Insert: {
          id: string
          plant_slug: string
          system_id: string
          ultima: string
          vencimiento: string
        }
        Update: {
          id?: string
          plant_slug?: string
          system_id?: string
          ultima?: string
          vencimiento?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "certifications_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          industry: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          industry?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          industry?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          fecha: string
          id: string
          name: string
          plant_slug: string
          project_id: string
          size_label: string
          type: string
        }
        Insert: {
          fecha: string
          id: string
          name: string
          plant_slug: string
          project_id: string
          size_label?: string
          type: string
        }
        Update: {
          fecha?: string
          id?: string
          name?: string
          plant_slug?: string
          project_id?: string
          size_label?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      library_docs: {
        Row: {
          category: string
          fecha: string
          id: string
          name: string
          size_label: string
        }
        Insert: {
          category: string
          fecha: string
          id: string
          name: string
          size_label?: string
        }
        Update: {
          category?: string
          fecha?: string
          id?: string
          name?: string
          size_label?: string
        }
        Relationships: []
      }
      plants: {
        Row: {
          company_slug: string
          created_at: string
          email: string
          industry: string
          location: string
          name: string
          responsable: string
          slug: string
        }
        Insert: {
          company_slug: string
          created_at?: string
          email?: string
          industry?: string
          location?: string
          name: string
          responsable?: string
          slug: string
        }
        Update: {
          company_slug?: string
          created_at?: string
          email?: string
          industry?: string
          location?: string
          name?: string
          responsable?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "plants_company_slug_fkey"
            columns: ["company_slug"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          company_slug: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          requested_company_slug: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          company_slug?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          requested_company_slug?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          company_slug?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          requested_company_slug?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_slug_fkey"
            columns: ["company_slug"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["slug"]
          },
        ]
      }
      projects: {
        Row: {
          company_slug: string
          descripcion: string
          fecha: string
          id: string
          name: string
          plant_slug: string
          responsable: string
          status: string
          type: string
        }
        Insert: {
          company_slug: string
          descripcion?: string
          fecha: string
          id: string
          name: string
          plant_slug: string
          responsable?: string
          status?: string
          type: string
        }
        Update: {
          company_slug?: string
          descripcion?: string
          fecha?: string
          id?: string
          name?: string
          plant_slug?: string
          responsable?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_slug_fkey"
            columns: ["company_slug"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "projects_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string
          created_by: string | null
          descripcion: string
          fecha: string
          id: string
          plant_slug: string
          solicitante: string
          status: string
          tipo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          descripcion?: string
          fecha?: string
          id?: string
          plant_slug: string
          solicitante?: string
          status?: string
          tipo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          descripcion?: string
          fecha?: string
          id?: string
          plant_slug?: string
          solicitante?: string
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
        ]
      }
      systems: {
        Row: {
          id: string
          metros: number | null
          norma: string
          plant_slug: string
          type: string
          ubicacion: string
        }
        Insert: {
          id: string
          metros?: number | null
          norma?: string
          plant_slug: string
          type: string
          ubicacion?: string
        }
        Update: {
          id?: string
          metros?: number | null
          norma?: string
          plant_slug?: string
          type?: string
          ubicacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "systems_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          curso: string
          dc3: string
          emision: string
          id: string
          instructor: string
          nombre: string
          plant_slug: string
          puesto: string
          vencimiento: string
        }
        Insert: {
          curso?: string
          dc3?: string
          emision: string
          id: string
          instructor?: string
          nombre: string
          plant_slug: string
          puesto?: string
          vencimiento: string
        }
        Update: {
          curso?: string
          dc3?: string
          emision?: string
          id?: string
          instructor?: string
          nombre?: string
          plant_slug?: string
          puesto?: string
          vencimiento?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_plant_slug_fkey"
            columns: ["plant_slug"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_company: { Args: { _company_slug: string }; Returns: boolean }
      can_read_plant: { Args: { _plant_slug: string }; Returns: boolean }
      current_company: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_kg_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin_kg" | "equipo_kg" | "cliente_corp" | "cliente_planta"
      profile_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin_kg", "equipo_kg", "cliente_corp", "cliente_planta"],
      profile_status: ["pending", "approved", "rejected"],
    },
  },
} as const
