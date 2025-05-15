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
      admin_users: {
        Row: {
          created_at: string
          id: string
          last_login: string | null
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_login?: string | null
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login?: string | null
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_name: string
          count: number
          created_at: string
          id: string
          month: number
          updated_at: string
          year: number
        }
        Insert: {
          api_name: string
          count?: number
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          year: number
        }
        Update: {
          api_name?: string
          count?: number
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          date: string
          excerpt: string | null
          id: string
          imageurl: string | null
          tags: string[]
          title: string
        }
        Insert: {
          content: string
          date: string
          excerpt?: string | null
          id?: string
          imageurl?: string | null
          tags?: string[]
          title: string
        }
        Update: {
          content?: string
          date?: string
          excerpt?: string | null
          id?: string
          imageurl?: string | null
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          credentialurl: string | null
          date: string
          description: string | null
          filetype: string
          fileurl: string
          id: string
          issuer: string
          name: string
        }
        Insert: {
          credentialurl?: string | null
          date: string
          description?: string | null
          filetype: string
          fileurl: string
          id?: string
          issuer: string
          name: string
        }
        Update: {
          credentialurl?: string | null
          date?: string
          description?: string | null
          filetype?: string
          fileurl?: string
          id?: string
          issuer?: string
          name?: string
        }
        Relationships: []
      }
      collection_items: {
        Row: {
          animation_type: string | null
          collection_id: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          label: string
          updated_at: string
        }
        Insert: {
          animation_type?: string | null
          collection_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          label: string
          updated_at?: string
        }
        Update: {
          animation_type?: string | null
          collection_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          label?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          date: string | null
          description: string
          filetype: string | null
          fileurl: string | null
          githuburl: string | null
          id: string
          imageurl: string | null
          liveurl: string | null
          tags: string[]
          title: string
        }
        Insert: {
          date?: string | null
          description: string
          filetype?: string | null
          fileurl?: string | null
          githuburl?: string | null
          id?: string
          imageurl?: string | null
          liveurl?: string | null
          tags?: string[]
          title: string
        }
        Update: {
          date?: string | null
          description?: string
          filetype?: string | null
          fileurl?: string | null
          githuburl?: string | null
          id?: string
          imageurl?: string | null
          liveurl?: string | null
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          upload_date: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          upload_date?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          upload_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          page_name: string
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          page_name: string
          section_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          page_name?: string
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_api_usage: {
        Args: {
          api_name_param: string
          month_param: number
          year_param: number
        }
        Returns: Json
      }
      increment_api_usage: {
        Args: {
          api_name_param: string
          month_param: number
          year_param: number
        }
        Returns: undefined
      }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
