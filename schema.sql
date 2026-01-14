-- 1. Habilitar extensão para gerar UUIDs (se ainda não tiver)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CRIAR OS TIPOS PERSONALIZADOS (ENUMS)
-- Isso garante que só aceite esses valores específicos

CREATE TYPE user_role AS ENUM (
    'student', 
    'professor', 
    'tae', 
    'employee'
);

CREATE TYPE condition_status AS ENUM (
    'novo', 
    'seminovo', 
    'usado'
);

CREATE TYPE product_type AS ENUM (
    'venda', 
    'troca'
);

CREATE TYPE product_status AS ENUM (
    'ativo', 
    'vendido', 
    'removido', 
    'moderacao'
);

CREATE TYPE report_status AS ENUM (
    'pendente', 
    'analise', 
    'resolvido'
);

-- 3. CRIAR AS TABELAS

-- Tabela de Perfis (Usuários)
CREATE TABLE profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    matricula text NOT NULL,
    password text NOT NULL,
    role user_role NOT NULL DEFAULT 'student' -- Usa o tipo criado acima
);

-- Tabela de Categorias
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    namecategories text NOT NULL,
    icon text
);

-- Tabela de Produtos
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    created_at timestamp DEFAULT now(),
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    status product_status DEFAULT 'ativo', -- Usa o ENUM product_status
    condition condition_status,            -- Usa o ENUM condition_status
    type product_type NOT NULL             -- Usa o ENUM product_type
);

-- Imagens dos Produtos
CREATE TABLE product_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    is_cover boolean DEFAULT false,
    created_at timestamp DEFAULT now()
);

-- Favoritos
CREATE TABLE favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now()
);

-- Mensagens (Chat)
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    message text,
    image_url text,
    created_at timestamp DEFAULT now(),
    read_at timestamp
);

-- Denúncias (Reports)
CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    reason text NOT NULL,
    status report_status DEFAULT 'pendente', -- Usa o ENUM report_status
    created_at timestamp DEFAULT now()
);