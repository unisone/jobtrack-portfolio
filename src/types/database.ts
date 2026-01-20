export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applied_date: string | null
          company: string
          company_logo: string | null
          company_url: string | null
          created_at: string | null
          description: string | null
          hiring_manager: string | null
          id: string
          interview_notes: string | null
          job_type: string | null
          job_url: string | null
          location: string | null
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          priority: string | null
          recruiter_email: string | null
          recruiter_name: string | null
          recruiter_phone: string | null
          referral_name: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applied_date?: string | null
          company: string
          company_logo?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          hiring_manager?: string | null
          id?: string
          interview_notes?: string | null
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          recruiter_email?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          referral_name?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applied_date?: string | null
          company?: string
          company_logo?: string | null
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          hiring_manager?: string | null
          id?: string
          interview_notes?: string | null
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          recruiter_email?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          referral_name?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          job_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          career_goals: string | null
          created_at: string | null
          current_company: string | null
          current_title: string | null
          elevator_pitch: string | null
          email: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_job_type: string[] | null
          resume_text: string | null
          resume_url: string | null
          skills: string[] | null
          target_roles: string[] | null
          target_salary_max: number | null
          target_salary_min: number | null
          updated_at: string | null
          user_id: string | null
          willing_to_relocate: boolean | null
          years_of_experience: number | null
        }
        Insert: {
          career_goals?: string | null
          created_at?: string | null
          current_company?: string | null
          current_title?: string | null
          elevator_pitch?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_type?: string[] | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          target_roles?: string[] | null
          target_salary_max?: number | null
          target_salary_min?: number | null
          updated_at?: string | null
          user_id?: string | null
          willing_to_relocate?: boolean | null
          years_of_experience?: number | null
        }
        Update: {
          career_goals?: string | null
          created_at?: string | null
          current_company?: string | null
          current_title?: string | null
          elevator_pitch?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_type?: string[] | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: string[] | null
          target_roles?: string[] | null
          target_salary_max?: number | null
          target_salary_min?: number | null
          updated_at?: string | null
          user_id?: string | null
          willing_to_relocate?: boolean | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Convenience type aliases
export type DbJob = Tables<'jobs'>
export type DbJobInsert = TablesInsert<'jobs'>
export type DbJobUpdate = TablesUpdate<'jobs'>

export type DbProfile = Tables<'profiles'>
export type DbProfileInsert = TablesInsert<'profiles'>
export type DbProfileUpdate = TablesUpdate<'profiles'>

export type DbNote = Tables<'notes'>
export type DbNoteInsert = TablesInsert<'notes'>
export type DbNoteUpdate = TablesUpdate<'notes'>

export type DbActivity = Tables<'activities'>
export type DbActivityInsert = TablesInsert<'activities'>
export type DbActivityUpdate = TablesUpdate<'activities'>
