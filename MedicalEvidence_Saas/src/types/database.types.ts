export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      evidence_items: {
        Row: {
          id: string
          user_id: string
          source_type: 'pmid' | 'doi' | 'pdf'
          pmid: string | null
          doi: string | null
          title: string
          journal: string | null
          year: number | null
          abstract: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_type: 'pmid' | 'doi' | 'pdf'
          pmid?: string | null
          doi?: string | null
          title: string
          journal?: string | null
          year?: number | null
          abstract?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_type?: 'pmid' | 'doi' | 'pdf'
          pmid?: string | null
          doi?: string | null
          title?: string
          journal?: string | null
          year?: number | null
          abstract?: string | null
          created_at?: string
        }
      }
      evidence_structures: {
        Row: {
          id: string
          evidence_id: string
          study_type: string | null
          population: string | null
          intervention: string | null
          comparison: string | null
          outcome: string | null
          results: string | null
          safety: string | null
          limitations: string | null
          evidence_strength: string | null
          created_at: string
        }
        Insert: {
          id?: string
          evidence_id: string
          study_type?: string | null
          population?: string | null
          intervention?: string | null
          comparison?: string | null
          outcome?: string | null
          results?: string | null
          safety?: string | null
          limitations?: string | null
          evidence_strength?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          evidence_id?: string
          study_type?: string | null
          population?: string | null
          intervention?: string | null
          comparison?: string | null
          outcome?: string | null
          results?: string | null
          safety?: string | null
          limitations?: string | null
          evidence_strength?: string | null
          created_at?: string
        }
      }
      content_assets: {
        Row: {
          id: string
          evidence_id: string
          content_type: 'card_news' | 'visual_abstract' | 'sns_thread' | 'blog'
          language: string
          content_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          evidence_id: string
          content_type: 'card_news' | 'visual_abstract' | 'sns_thread' | 'blog'
          language?: string
          content_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          evidence_id?: string
          content_type?: 'card_news' | 'visual_abstract' | 'sns_thread' | 'blog'
          language?: string
          content_json?: Json
          created_at?: string
        }
      }
    }
  }
}
