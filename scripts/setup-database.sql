-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'training', 'deployed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects ON DELETE CASCADE NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  file_format TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_jobs table
CREATE TABLE IF NOT EXISTS training_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  project_id UUID REFERENCES projects ON DELETE CASCADE NOT NULL,
  model_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  accuracy DECIMAL(5,4),
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  project_id UUID REFERENCES projects ON DELETE CASCADE NOT NULL,
  training_job_id UUID REFERENCES training_jobs ON DELETE SET NULL,
  accuracy DECIMAL(5,4),
  status TEXT DEFAULT 'training' CHECK (status IN ('training', 'ready', 'deployed')),
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view datasets in own projects" ON datasets FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = datasets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create datasets in own projects" ON datasets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = datasets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update datasets in own projects" ON datasets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = datasets.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can delete datasets in own projects" ON datasets FOR DELETE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = datasets.project_id AND projects.user_id = auth.uid())
);

-- Similar policies for training_jobs and models
CREATE POLICY "Users can view training jobs in own projects" ON training_jobs FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = training_jobs.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create training jobs in own projects" ON training_jobs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = training_jobs.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Users can view models in own projects" ON models FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = models.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can create models in own projects" ON models FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = models.project_id AND projects.user_id = auth.uid())
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
