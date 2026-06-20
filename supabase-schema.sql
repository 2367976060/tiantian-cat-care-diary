-- 甜甜育儿记录本 - Supabase 数据库 Schema
-- Tiantian Cat Care Diary - Supabase Database Schema

-- 启用 pgcrypto 扩展（用于生成UUID）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 家庭表（用于多家庭数据隔离）
-- ============================================
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 母猫信息表
-- ============================================
CREATE TABLE IF NOT EXISTS mother_cats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL DEFAULT '甜甜',
    breed VARCHAR(50),
    age VARCHAR(20),
    weight DECIMAL(5,2),
    avatar VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 幼崽表
-- ============================================
CREATE TABLE IF NOT EXISTS kittens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    color VARCHAR(50),
    birth_date DATE,
    weight INTEGER,
    weight_history JSONB DEFAULT '[]'::jsonb,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 喂食记录表
-- ============================================
CREATE TABLE IF NOT EXISTS feeding_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(8,2),
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 喂药记录表
-- ============================================
CREATE TABLE IF NOT EXISTS medicine_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    dose DECIMAL(8,2),
    unit VARCHAR(20),
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    note TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 吃奶记录表
-- ============================================
CREATE TABLE IF NOT EXISTS nursing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    kitten_ids JSONB DEFAULT '[]'::jsonb,
    note TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 照片表
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    category VARCHAR(50),
    desc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 幼崽成长记录表
-- ============================================
CREATE TABLE IF NOT EXISTS kitten_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    kitten_ids JSONB DEFAULT '[]'::jsonb,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100),
    content TEXT,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 提醒表
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    repeat_interval VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 设置表（每个家庭一份设置）
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE UNIQUE,
    dark_mode BOOLEAN DEFAULT false,
    default_kitten_names JSONB DEFAULT '["老大", "老二", "老三", "老四"]'::jsonb,
    medicines JSONB DEFAULT '[]'::jsonb,
    medicine_doses JSONB DEFAULT '["0.5", "1", "2"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 创建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_kittens_family_id ON kittens(family_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_family_id ON feeding_logs(family_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_time ON feeding_logs(time DESC);
CREATE INDEX IF NOT EXISTS idx_medicine_logs_family_id ON medicine_logs(family_id);
CREATE INDEX IF NOT EXISTS idx_medicine_logs_time ON medicine_logs(time DESC);
CREATE INDEX IF NOT EXISTS idx_nursing_logs_family_id ON nursing_logs(family_id);
CREATE INDEX IF NOT EXISTS idx_nursing_logs_start_time ON nursing_logs(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_photos_family_id ON photos(family_id);
CREATE INDEX IF NOT EXISTS idx_kitten_records_family_id ON kitten_records(family_id);
CREATE INDEX IF NOT EXISTS idx_kitten_records_time ON kitten_records(time DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_family_id ON reminders(family_id);

-- ============================================
-- 启用行级安全策略 (RLS)
-- ============================================
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE mother_cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE kittens ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitten_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 创建策略（允许匿名访问，通过family_code区分）
-- 注意：生产环境建议使用更严格的认证方式
-- ============================================

-- 家庭表策略
CREATE POLICY "Allow read access to families by code"
    ON families FOR SELECT
    USING (true);

CREATE POLICY "Allow insert access to families"
    ON families FOR INSERT
    WITH CHECK (true);

-- 其他表策略（通过family_id关联）
-- 这里简化处理，允许所有访问，实际项目中应结合认证
CREATE POLICY "Allow all access to mother_cats"
    ON mother_cats FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to kittens"
    ON kittens FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to feeding_logs"
    ON feeding_logs FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to medicine_logs"
    ON medicine_logs FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to nursing_logs"
    ON nursing_logs FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to photos"
    ON photos FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to kitten_records"
    ON kitten_records FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to reminders"
    ON reminders FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to settings"
    ON settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 插入默认家庭数据（可选）
-- ============================================
-- INSERT INTO families (family_code, name) VALUES ('default', '默认家庭');
