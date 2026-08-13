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
      assessments: {
        Row: {
          attended: boolean | null
          created_at: string
          enrollment_id: string
          evaluated_at: string | null
          evaluated_by: string | null
          grade: number | null
          id: string
          notes: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          attended?: boolean | null
          created_at?: string
          enrollment_id: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          grade?: number | null
          id?: string
          notes?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          attended?: boolean | null
          created_at?: string
          enrollment_id?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          grade?: number | null
          id?: string
          notes?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          category: string
          content_type: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          legacy_url: string | null
          organization_id: string
          original_name: string
          sha256: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          content_type?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          legacy_url?: string | null
          organization_id: string
          original_name: string
          sha256?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          content_type?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          legacy_url?: string | null
          organization_id?: string
          original_name?: string
          sha256?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          id: number
          new_data: Json | null
          occurred_at: string
          old_data: Json | null
          organization_id: string | null
          record_id: string | null
          request_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          id?: never
          new_data?: Json | null
          occurred_at?: string
          old_data?: Json | null
          organization_id?: string | null
          record_id?: string | null
          request_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          id?: never
          new_data?: Json | null
          occurred_at?: string
          old_data?: Json | null
          organization_id?: string | null
          record_id?: string | null
          request_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          classification: string | null
          color: string | null
          created_at: string
          ends_at: string | null
          event_type: string
          id: string
          legacy_id: string | null
          location: string | null
          organization_id: string
          quote_id: string | null
          service_order_id: string | null
          session_id: string | null
          source_payload: Json | null
          starts_at: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          classification?: string | null
          color?: string | null
          created_at?: string
          ends_at?: string | null
          event_type: string
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id: string
          quote_id?: string | null
          service_order_id?: string | null
          session_id?: string | null
          source_payload?: Json | null
          starts_at: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          classification?: string | null
          color?: string | null
          created_at?: string
          ends_at?: string | null
          event_type?: string
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id?: string
          quote_id?: string | null
          service_order_id?: string | null
          session_id?: string | null
          source_payload?: Json | null
          starts_at?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      client_fiscal_profiles: {
        Row: {
          active: boolean
          city: string | null
          client_id: string
          created_at: string
          email: string | null
          exterior_number: string | null
          fiscal_regime: string | null
          id: string
          interior_number: string | null
          legal_name: string
          neighborhood: string | null
          organization_id: string
          postal_code: string | null
          rfc: string
          sat_validation_status: string | null
          state: string | null
          street: string | null
          updated_at: string
          validated_at: string | null
        }
        Insert: {
          active?: boolean
          city?: string | null
          client_id: string
          created_at?: string
          email?: string | null
          exterior_number?: string | null
          fiscal_regime?: string | null
          id?: string
          interior_number?: string | null
          legal_name: string
          neighborhood?: string | null
          organization_id: string
          postal_code?: string | null
          rfc: string
          sat_validation_status?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          validated_at?: string | null
        }
        Update: {
          active?: boolean
          city?: string | null
          client_id?: string
          created_at?: string
          email?: string | null
          exterior_number?: string | null
          fiscal_regime?: string | null
          id?: string
          interior_number?: string | null
          legal_name?: string
          neighborhood?: string | null
          organization_id?: string
          postal_code?: string | null
          rfc?: string
          sat_validation_status?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_fiscal_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_fiscal_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          city: string | null
          code: string | null
          commercial_name: string
          country_code: string
          created_at: string
          email: string | null
          exterior_number: string | null
          id: string
          interior_number: string | null
          legacy_id: string | null
          legal_name: string | null
          neighborhood: string | null
          organization_id: string
          phone: string | null
          postal_code: string | null
          source_payload: Json | null
          state: string | null
          street: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          code?: string | null
          commercial_name: string
          country_code?: string
          created_at?: string
          email?: string | null
          exterior_number?: string | null
          id?: string
          interior_number?: string | null
          legacy_id?: string | null
          legal_name?: string | null
          neighborhood?: string | null
          organization_id: string
          phone?: string | null
          postal_code?: string | null
          source_payload?: Json | null
          state?: string | null
          street?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          city?: string | null
          code?: string | null
          commercial_name?: string
          country_code?: string
          created_at?: string
          email?: string | null
          exterior_number?: string | null
          id?: string
          interior_number?: string | null
          legacy_id?: string | null
          legal_name?: string | null
          neighborhood?: string | null
          organization_id?: string
          phone?: string | null
          postal_code?: string | null
          source_payload?: Json | null
          state?: string | null
          street?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      contractors: {
        Row: {
          active: boolean
          code: string | null
          created_at: string
          email: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          phone: string | null
          source_payload: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          phone?: string | null
          source_payload?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          source_payload?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_classifications: {
        Row: {
          active: boolean
          code: string | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_classifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_groups: {
        Row: {
          active: boolean
          classification_id: string | null
          code: string | null
          created_at: string
          description: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          classification_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          classification_id?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_groups_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "course_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          capacity: number | null
          client_id: string | null
          course_id: string | null
          course_number: string | null
          created_at: string
          delivery_type: string | null
          ends_at: string | null
          id: string
          instructor_id: string | null
          legacy_id: string | null
          location: string | null
          organization_id: string
          service_id: string | null
          service_order_id: string
          session_date: string
          signature_template_legacy_id: string | null
          source_payload: Json | null
          starts_at: string | null
          status: string
          travel_mode: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          client_id?: string | null
          course_id?: string | null
          course_number?: string | null
          created_at?: string
          delivery_type?: string | null
          ends_at?: string | null
          id?: string
          instructor_id?: string | null
          legacy_id?: string | null
          location?: string | null
          organization_id: string
          service_id?: string | null
          service_order_id: string
          session_date: string
          signature_template_legacy_id?: string | null
          source_payload?: Json | null
          starts_at?: string | null
          status?: string
          travel_mode?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          client_id?: string | null
          course_id?: string | null
          course_number?: string | null
          created_at?: string
          delivery_type?: string | null
          ends_at?: string | null
          id?: string
          instructor_id?: string | null
          legacy_id?: string | null
          location?: string | null
          organization_id?: string
          service_id?: string | null
          service_order_id?: string
          session_date?: string
          signature_template_legacy_id?: string | null
          source_payload?: Json | null
          starts_at?: string | null
          status?: string
          travel_mode?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          active: boolean
          classification_id: string | null
          code: string | null
          cost: number | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          duration_text_legacy: string | null
          group_id: string | null
          id: string
          legacy_id: string | null
          local_unit_price: number | null
          name: string
          organization_id: string
          required_equipment: string | null
          source_payload: Json | null
          supply_name_legacy: string | null
          training_agent_id: string | null
          travel_unit_price: number | null
          updated_at: string
          visible_on_web: boolean
        }
        Insert: {
          active?: boolean
          classification_id?: string | null
          code?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          duration_text_legacy?: string | null
          group_id?: string | null
          id?: string
          legacy_id?: string | null
          local_unit_price?: number | null
          name: string
          organization_id: string
          required_equipment?: string | null
          source_payload?: Json | null
          supply_name_legacy?: string | null
          training_agent_id?: string | null
          travel_unit_price?: number | null
          updated_at?: string
          visible_on_web?: boolean
        }
        Update: {
          active?: boolean
          classification_id?: string | null
          code?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          duration_text_legacy?: string | null
          group_id?: string | null
          id?: string
          legacy_id?: string | null
          local_unit_price?: number | null
          name?: string
          organization_id?: string
          required_equipment?: string | null
          source_payload?: Json | null
          supply_name_legacy?: string | null
          training_agent_id?: string | null
          travel_unit_price?: number | null
          updated_at?: string
          visible_on_web?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "courses_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "course_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "course_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_training_agent_id_fkey"
            columns: ["training_agent_id"]
            isOneToOne: false
            referencedRelation: "training_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      dc3_certificates: {
        Row: {
          created_at: string
          enrollment_id: string
          folio: string | null
          generated: boolean
          generated_at: string | null
          generated_by: string | null
          id: string
          organization_id: string
          source_payload: Json | null
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          folio?: string | null
          generated?: boolean
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          organization_id: string
          source_payload?: Json | null
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          folio?: string | null
          generated?: boolean
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          organization_id?: string
          source_payload?: Json | null
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dc3_certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dc3_certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      enrollments: {
        Row: {
          course_type: string | null
          created_at: string
          height_training: string | null
          id: string
          legacy_quote_line_id: string | null
          legacy_service_order_id: string | null
          organization_id: string
          participant_id: string
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          course_type?: string | null
          created_at?: string
          height_training?: string | null
          id?: string
          legacy_quote_line_id?: string | null
          legacy_service_order_id?: string | null
          organization_id: string
          participant_id: string
          session_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          course_type?: string | null
          created_at?: string
          height_training?: string | null
          id?: string
          legacy_quote_line_id?: string | null
          legacy_service_order_id?: string | null
          organization_id?: string
          participant_id?: string
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_alerts: {
        Row: {
          created_at: string
          es_prueba: boolean
          id: string
          lead_id: string | null
          mensaje: string
          resuelta: boolean
          resuelta_at: string | null
          severidad: string
          tipo: string
          titulo: string
          trace_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          es_prueba?: boolean
          id?: string
          lead_id?: string | null
          mensaje?: string
          resuelta?: boolean
          resuelta_at?: string | null
          severidad?: string
          tipo?: string
          titulo?: string
          trace_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          es_prueba?: boolean
          id?: string
          lead_id?: string | null
          mensaje?: string
          resuelta?: boolean
          resuelta_at?: string | null
          severidad?: string
          tipo?: string
          titulo?: string
          trace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_alerts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_logs: {
        Row: {
          created_at: string
          detalle: Json
          duracion_ms: number
          error_code: string
          error_message: string
          es_prueba: boolean
          id: string
          intento: number
          lead_id: string | null
          metodo: string
          modo: string
          ok: boolean
          operacion: string
          path: string
          stage: string
          status_code: number | null
          trace_id: string
        }
        Insert: {
          created_at?: string
          detalle?: Json
          duracion_ms?: number
          error_code?: string
          error_message?: string
          es_prueba?: boolean
          id?: string
          intento?: number
          lead_id?: string | null
          metodo?: string
          modo?: string
          ok?: boolean
          operacion?: string
          path?: string
          stage?: string
          status_code?: number | null
          trace_id?: string
        }
        Update: {
          created_at?: string
          detalle?: Json
          duracion_ms?: number
          error_code?: string
          error_message?: string
          es_prueba?: boolean
          id?: string
          intento?: number
          lead_id?: string | null
          metodo?: string
          modo?: string
          ok?: boolean
          operacion?: string
          path?: string
          stage?: string
          status_code?: number | null
          trace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_outbox: {
        Row: {
          created_at: string
          es_prueba: boolean
          estado: string
          id: string
          intentos: number
          last_error: string
          lead_id: string | null
          max_intentos: number
          modo: string
          next_attempt_at: string
          payload: Json
          tipo: string
          trace_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          es_prueba?: boolean
          estado?: string
          id?: string
          intentos?: number
          last_error?: string
          lead_id?: string | null
          max_intentos?: number
          modo?: string
          next_attempt_at?: string
          payload?: Json
          tipo?: string
          trace_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          es_prueba?: boolean
          estado?: string
          id?: string
          intentos?: number
          last_error?: string
          lead_id?: string | null
          max_intentos?: number
          modo?: string
          next_attempt_at?: string
          payload?: Json
          tipo?: string
          trace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_outbox_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          completed_at: string | null
          counts: Json
          created_by: string | null
          errors: Json
          id: string
          organization_id: string
          source_manifest_sha256: string | null
          source_system: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          counts?: Json
          created_by?: string | null
          errors?: Json
          id?: string
          organization_id: string
          source_manifest_sha256?: string | null
          source_system: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          counts?: Json
          created_by?: string | null
          errors?: Json
          id?: string
          organization_id?: string
          source_manifest_sha256?: string | null
          source_system?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_courses: {
        Row: {
          active: boolean
          course_id: string
          instructor_id: string
          legacy_id: string | null
          organization_id: string
          training_agent_id: string | null
        }
        Insert: {
          active?: boolean
          course_id: string
          instructor_id: string
          legacy_id?: string | null
          organization_id: string
          training_agent_id?: string | null
        }
        Update: {
          active?: boolean
          course_id?: string
          instructor_id?: string
          legacy_id?: string | null
          organization_id?: string
          training_agent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_courses_training_agent_id_fkey"
            columns: ["training_agent_id"]
            isOneToOne: false
            referencedRelation: "training_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          active: boolean
          code: string | null
          color: string | null
          created_at: string
          email: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          specialty: string | null
          tax_id: string | null
          updated_at: string
          work_status: string | null
        }
        Insert: {
          active?: boolean
          code?: string | null
          color?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          specialty?: string | null
          tax_id?: string | null
          updated_at?: string
          work_status?: string | null
        }
        Update: {
          active?: boolean
          code?: string | null
          color?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          specialty?: string | null
          tax_id?: string | null
          updated_at?: string
          work_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_documents: {
        Row: {
          content_type: string | null
          created_at: string
          id: string
          invoice_id: string
          kind: string
          organization_id: string
          sha256: string | null
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          id?: string
          invoice_id: string
          kind: string
          organization_id: string
          sha256?: string | null
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          id?: string
          invoice_id?: string
          kind?: string
          organization_id?: string
          sha256?: string | null
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_documents_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_events: {
        Row: {
          actor_id: string | null
          created_at: string
          detail: Json
          event_type: string
          id: string
          invoice_id: string
          organization_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          detail?: Json
          event_type: string
          id?: string
          invoice_id: string
          organization_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          detail?: Json
          event_type?: string
          id?: string
          invoice_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_events_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          discount: number
          id: string
          invoice_id: string
          organization_id: string
          product_code: string | null
          quantity: number
          quote_line_id: string | null
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          unit_code: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number
          id?: string
          invoice_id: string
          organization_id: string
          product_code?: string | null
          quantity?: number
          quote_line_id?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          unit_code?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number
          id?: string
          invoice_id?: string
          organization_id?: string
          product_code?: string | null
          quantity?: number
          quote_line_id?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          unit_code?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_quote_line_id_fkey"
            columns: ["quote_line_id"]
            isOneToOne: false
            referencedRelation: "quote_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          canceled_at: string | null
          canceled_by: string | null
          cfdi_use: string | null
          client_id: string
          created_at: string
          created_by: string | null
          currency: string
          discount: number
          error_code: string | null
          error_message: string | null
          exchange_rate: number
          export_code: string | null
          fiscal_profile_id: string | null
          folio: string | null
          id: string
          idempotency_key: string
          issued_at: string | null
          organization_id: string
          payment_form: string | null
          payment_method: string | null
          payment_reference: string | null
          provider: string | null
          provider_external_id: string | null
          quote_id: string | null
          request_snapshot: Json | null
          response_snapshot_redacted: Json | null
          series: string | null
          status: string
          subtotal: number
          tax_total: number
          total: number
          updated_at: string
          uuid_fiscal: string | null
        }
        Insert: {
          canceled_at?: string | null
          canceled_by?: string | null
          cfdi_use?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          discount?: number
          error_code?: string | null
          error_message?: string | null
          exchange_rate?: number
          export_code?: string | null
          fiscal_profile_id?: string | null
          folio?: string | null
          id?: string
          idempotency_key: string
          issued_at?: string | null
          organization_id: string
          payment_form?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_external_id?: string | null
          quote_id?: string | null
          request_snapshot?: Json | null
          response_snapshot_redacted?: Json | null
          series?: string | null
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
          uuid_fiscal?: string | null
        }
        Update: {
          canceled_at?: string | null
          canceled_by?: string | null
          cfdi_use?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          discount?: number
          error_code?: string | null
          error_message?: string | null
          exchange_rate?: number
          export_code?: string | null
          fiscal_profile_id?: string | null
          folio?: string | null
          id?: string
          idempotency_key?: string
          issued_at?: string | null
          organization_id?: string
          payment_form?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_external_id?: string | null
          quote_id?: string | null
          request_snapshot?: Json | null
          response_snapshot_redacted?: Json | null
          series?: string | null
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
          uuid_fiscal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fiscal_profile_id_fkey"
            columns: ["fiscal_profile_id"]
            isOneToOne: false
            referencedRelation: "client_fiscal_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          autor_id: string | null
          autor_nombre: string
          created_at: string
          detalle: string
          id: string
          lead_id: string
          tipo: string
        }
        Insert: {
          autor_id?: string | null
          autor_nombre?: string
          created_at?: string
          detalle?: string
          id?: string
          lead_id: string
          tipo?: string
        }
        Update: {
          autor_id?: string | null
          autor_nombre?: string
          created_at?: string
          detalle?: string
          id?: string
          lead_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          comentarios: string
          contacto_correo: string
          contacto_nombre: string
          contacto_telefono: string
          contratista_id: number | null
          contratista_nombre: string
          created_at: string
          curso_id: number | null
          curso_nombre: string
          empresa: string
          erp_error: string
          erp_folio: string
          erp_intentos: number
          erp_last_attempt_at: string | null
          erp_solicitud_id: string
          erp_status: string
          erp_trace_id: string
          es_prueba: boolean
          etapa: string
          fecha_deseada: string | null
          id: string
          lugar_servicio: string
          modalidad: string
          modo: string
          origen: string
          participantes: number | null
          responsable: string
          rfc: string
          servicio_id: number | null
          tipo_curso: string
          updated_at: string
          valor_estimado: number | null
        }
        Insert: {
          comentarios?: string
          contacto_correo?: string
          contacto_nombre?: string
          contacto_telefono?: string
          contratista_id?: number | null
          contratista_nombre?: string
          created_at?: string
          curso_id?: number | null
          curso_nombre?: string
          empresa?: string
          erp_error?: string
          erp_folio?: string
          erp_intentos?: number
          erp_last_attempt_at?: string | null
          erp_solicitud_id?: string
          erp_status?: string
          erp_trace_id?: string
          es_prueba?: boolean
          etapa?: string
          fecha_deseada?: string | null
          id?: string
          lugar_servicio?: string
          modalidad?: string
          modo?: string
          origen?: string
          participantes?: number | null
          responsable?: string
          rfc?: string
          servicio_id?: number | null
          tipo_curso?: string
          updated_at?: string
          valor_estimado?: number | null
        }
        Update: {
          comentarios?: string
          contacto_correo?: string
          contacto_nombre?: string
          contacto_telefono?: string
          contratista_id?: number | null
          contratista_nombre?: string
          created_at?: string
          curso_id?: number | null
          curso_nombre?: string
          empresa?: string
          erp_error?: string
          erp_folio?: string
          erp_intentos?: number
          erp_last_attempt_at?: string | null
          erp_solicitud_id?: string
          erp_status?: string
          erp_trace_id?: string
          es_prueba?: boolean
          etapa?: string
          fecha_deseada?: string | null
          id?: string
          lugar_servicio?: string
          modalidad?: string
          modo?: string
          origen?: string
          participantes?: number | null
          responsable?: string
          rfc?: string
          servicio_id?: number | null
          tipo_curso?: string
          updated_at?: string
          valor_estimado?: number | null
        }
        Relationships: []
      }
      legacy_reference_records: {
        Row: {
          created_at: string
          id: string
          legacy_key: string
          organization_id: string
          record_type: string
          source_payload: Json
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_key: string
          organization_id: string
          record_type: string
          source_payload?: Json
        }
        Update: {
          created_at?: string
          id?: string
          legacy_key?: string
          organization_id?: string
          record_type?: string
          source_payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "legacy_reference_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      organization_members: {
        Row: {
          active: boolean
          created_at: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          legacy_client_assignment_id: string | null
          legacy_company_id: string | null
          legal_name: string | null
          name: string
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          legacy_client_assignment_id?: string | null
          legacy_company_id?: string | null
          legal_name?: string | null
          name: string
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          legacy_client_assignment_id?: string | null
          legacy_company_id?: string | null
          legal_name?: string | null
          name?: string
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          birth_date: string | null
          created_at: string
          curp: string | null
          employer_commercial_name: string | null
          employer_legal_name: string | null
          employer_tax_id: string | null
          gender: string | null
          given_names: string
          id: string
          legacy_id: string | null
          legal_representative: string | null
          maternal_surname: string | null
          occupation: string | null
          organization_id: string
          paternal_surname: string | null
          position: string | null
          updated_at: string
          workers_representative: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          curp?: string | null
          employer_commercial_name?: string | null
          employer_legal_name?: string | null
          employer_tax_id?: string | null
          gender?: string | null
          given_names: string
          id?: string
          legacy_id?: string | null
          legal_representative?: string | null
          maternal_surname?: string | null
          occupation?: string | null
          organization_id: string
          paternal_surname?: string | null
          position?: string | null
          updated_at?: string
          workers_representative?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          curp?: string | null
          employer_commercial_name?: string | null
          employer_legal_name?: string | null
          employer_tax_id?: string | null
          gender?: string | null
          given_names?: string
          id?: string
          legacy_id?: string | null
          legal_representative?: string | null
          maternal_surname?: string | null
          occupation?: string | null
          organization_id?: string
          paternal_surname?: string | null
          position?: string | null
          updated_at?: string
          workers_representative?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      per_diems: {
        Row: {
          amount: number
          created_at: string
          days: number | null
          destination_city: string | null
          end_date: string
          id: string
          instructor_id: string | null
          legacy_id: string | null
          legacy_quote_course_id: string | null
          note: string | null
          organization_id: string
          origin_city: string | null
          record_date: string | null
          session_id: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          days?: number | null
          destination_city?: string | null
          end_date: string
          id?: string
          instructor_id?: string | null
          legacy_id?: string | null
          legacy_quote_course_id?: string | null
          note?: string | null
          organization_id: string
          origin_city?: string | null
          record_date?: string | null
          session_id?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          days?: number | null
          destination_city?: string | null
          end_date?: string
          id?: string
          instructor_id?: string | null
          legacy_id?: string | null
          legacy_quote_course_id?: string | null
          note?: string | null
          organization_id?: string
          origin_city?: string | null
          record_date?: string | null
          session_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "per_diems_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "per_diems_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "per_diems_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      quote_lines: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          discounted_unit_price: number | null
          id: string
          legacy_id: string | null
          legacy_sequence: number | null
          organization_id: string
          quantity: number
          quote_id: string
          request_code_legacy: string | null
          scheduled_date: string | null
          source_payload: Json | null
          subtotal: number
          tax_rate: number
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          discounted_unit_price?: number | null
          id?: string
          legacy_id?: string | null
          legacy_sequence?: number | null
          organization_id: string
          quantity?: number
          quote_id: string
          request_code_legacy?: string | null
          scheduled_date?: string | null
          source_payload?: Json | null
          subtotal?: number
          tax_rate?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          discounted_unit_price?: number | null
          id?: string
          legacy_id?: string | null
          legacy_sequence?: number | null
          organization_id?: string
          quantity?: number
          quote_id?: string
          request_code_legacy?: string | null
          scheduled_date?: string | null
          source_payload?: Json | null
          subtotal?: number
          tax_rate?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_lines_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_lines_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          alternate_contractor_name: string | null
          client_id: string | null
          code: string | null
          comments: string | null
          contact_email: string | null
          contact_phone: string | null
          contractor_id: string | null
          course_id: string | null
          created_at: string
          created_by: string | null
          delivery_type: string | null
          id: string
          legacy_id: string | null
          location: string | null
          organization_id: string
          participant_count: number | null
          request_date: string
          service_id: string | null
          source_payload: Json | null
          status: string
          travel_mode: string | null
          updated_at: string
        }
        Insert: {
          alternate_contractor_name?: string | null
          client_id?: string | null
          code?: string | null
          comments?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contractor_id?: string | null
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          delivery_type?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id: string
          participant_count?: number | null
          request_date: string
          service_id?: string | null
          source_payload?: Json | null
          status?: string
          travel_mode?: string | null
          updated_at?: string
        }
        Update: {
          alternate_contractor_name?: string | null
          client_id?: string | null
          code?: string | null
          comments?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contractor_id?: string | null
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          delivery_type?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id?: string
          participant_count?: number | null
          request_date?: string
          service_id?: string | null
          source_payload?: Json | null
          status?: string
          travel_mode?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string | null
          code: string | null
          comments: string | null
          created_at: string
          created_by: string | null
          currency: string
          delivery_type: string | null
          department_legacy_id: string | null
          id: string
          legacy_id: string | null
          location: string | null
          organization_id: string
          origin: string | null
          purchase_order: string | null
          quote_date: string
          report_template_legacy_id: string | null
          request_id: string | null
          requires_payment: boolean
          revision: number
          service_id: string | null
          source_payload: Json | null
          status: string
          subtotal: number
          tax_total: number
          total: number
          travel_mode: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_id?: string | null
          code?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          delivery_type?: string | null
          department_legacy_id?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id: string
          origin?: string | null
          purchase_order?: string | null
          quote_date: string
          report_template_legacy_id?: string | null
          request_id?: string | null
          requires_payment?: boolean
          revision?: number
          service_id?: string | null
          source_payload?: Json | null
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          travel_mode?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string | null
          code?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          delivery_type?: string | null
          department_legacy_id?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id?: string
          origin?: string | null
          purchase_order?: string | null
          quote_date?: string
          report_template_legacy_id?: string | null
          request_id?: string | null
          requires_payment?: boolean
          revision?: number
          service_id?: string | null
          source_payload?: Json | null
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          travel_mode?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          client_id: string | null
          code: string | null
          created_at: string
          created_by: string | null
          id: string
          legacy_id: string | null
          location: string | null
          organization_id: string
          quote_id: string | null
          quote_line_id: string | null
          report_template_legacy_id: string | null
          service_date: string
          service_id: string | null
          signature_template_legacy_id: string | null
          source_payload: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id: string
          quote_id?: string | null
          quote_line_id?: string | null
          report_template_legacy_id?: string | null
          service_date: string
          service_id?: string | null
          signature_template_legacy_id?: string | null
          source_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          legacy_id?: string | null
          location?: string | null
          organization_id?: string
          quote_id?: string | null
          quote_line_id?: string | null
          report_template_legacy_id?: string | null
          service_date?: string
          service_id?: string | null
          signature_template_legacy_id?: string | null
          source_payload?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_quote_line_id_fkey"
            columns: ["quote_line_id"]
            isOneToOne: false
            referencedRelation: "quote_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
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
      services: {
        Row: {
          active: boolean
          code: string | null
          created_at: string
          description: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          service_type: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          service_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean
          city: string | null
          code: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          phone: string | null
          source_payload: Json | null
          state: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          code?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          phone?: string | null
          source_payload?: Json | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          city?: string | null
          code?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          source_payload?: Json | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
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
      training_agents: {
        Row: {
          active: boolean
          agent_type: string | null
          code: string | null
          color: string | null
          created_at: string
          id: string
          legacy_id: string | null
          name: string
          organization_id: string
          specialty: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          agent_type?: string | null
          code?: string | null
          color?: string | null
          created_at?: string
          id?: string
          legacy_id?: string | null
          name: string
          organization_id: string
          specialty?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          agent_type?: string | null
          code?: string | null
          color?: string | null
          created_at?: string
          id?: string
          legacy_id?: string | null
          name?: string
          organization_id?: string
          specialty?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_agents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
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
      has_org_role: {
        Args: { _organization_id: string; _roles: string[] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_kg_staff: { Args: { _user_id: string }; Returns: boolean }
      is_org_member: { Args: { _organization_id: string }; Returns: boolean }
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
