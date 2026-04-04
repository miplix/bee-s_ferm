-- Players table
CREATE TABLE IF NOT EXISTS players (
  account_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  x REAL NOT NULL DEFAULT 400,
  y REAL NOT NULL DEFAULT 300,
  resources JSONB NOT NULL DEFAULT '{"wood":0,"stone":0,"gold":0,"wheat":0,"iron":0}',
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Placed objects on player farms
CREATE TABLE IF NOT EXISTS placed_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL REFERENCES players(account_id) ON DELETE CASCADE,
  nft_token_id TEXT NOT NULL DEFAULT '',
  object_type TEXT NOT NULL,
  grid_x INTEGER NOT NULL,
  grid_y INTEGER NOT NULL,
  state JSONB NOT NULL DEFAULT '{}',
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_placed_objects_owner ON placed_objects(owner_id);

-- Enable Realtime for presence
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE placed_objects ENABLE ROW LEVEL SECURITY;

-- Players: anyone can read, only owner can update
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT USING (true);

CREATE POLICY "Players can update own data"
  ON players FOR UPDATE USING (auth.jwt() ->> 'sub' = account_id);

CREATE POLICY "Players can insert own data"
  ON players FOR INSERT WITH CHECK (true);

-- Placed objects: anyone can read (for visiting), owner can modify
CREATE POLICY "Objects are viewable by everyone"
  ON placed_objects FOR SELECT USING (true);

CREATE POLICY "Owner can insert objects"
  ON placed_objects FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can delete own objects"
  ON placed_objects FOR DELETE USING (auth.jwt() ->> 'sub' = owner_id);
