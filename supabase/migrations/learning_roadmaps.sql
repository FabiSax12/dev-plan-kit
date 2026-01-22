-- Learning Roadmaps Feature - Database Schema
-- Run this migration in Supabase SQL Editor

-- ============================================
-- Table: learning_roadmaps
-- ============================================
CREATE TABLE learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for learning_roadmaps
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roadmaps"
  ON learning_roadmaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps"
  ON learning_roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps"
  ON learning_roadmaps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps"
  ON learning_roadmaps FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Table: learning_phases
-- ============================================
CREATE TABLE learning_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES learning_roadmaps(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for learning_phases
ALTER TABLE learning_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view phases of their roadmaps"
  ON learning_phases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = learning_phases.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert phases to their roadmaps"
  ON learning_phases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update phases of their roadmaps"
  ON learning_phases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = learning_phases.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete phases of their roadmaps"
  ON learning_phases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps
      WHERE learning_roadmaps.id = learning_phases.roadmap_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

-- ============================================
-- Table: learning_items
-- ============================================
CREATE TABLE learning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES learning_phases(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for learning_items
ALTER TABLE learning_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their roadmaps"
  ON learning_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM learning_phases
      JOIN learning_roadmaps ON learning_roadmaps.id = learning_phases.roadmap_id
      WHERE learning_phases.id = learning_items.phase_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items to their roadmaps"
  ON learning_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_phases
      JOIN learning_roadmaps ON learning_roadmaps.id = learning_phases.roadmap_id
      WHERE learning_phases.id = phase_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their roadmaps"
  ON learning_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM learning_phases
      JOIN learning_roadmaps ON learning_roadmaps.id = learning_phases.roadmap_id
      WHERE learning_phases.id = learning_items.phase_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their roadmaps"
  ON learning_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM learning_phases
      JOIN learning_roadmaps ON learning_roadmaps.id = learning_phases.roadmap_id
      WHERE learning_phases.id = learning_items.phase_id
      AND learning_roadmaps.user_id = auth.uid()
    )
  );
