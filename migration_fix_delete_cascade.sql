-- Migration: Adicionar ON DELETE CASCADE para product_id na tabela messages
-- Isso permite que mensagens sejam deletadas automaticamente quando um produto for deletado

-- 1. Remover a constraint antiga (foreign key sem CASCADE)
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_product_id_fkey;

-- 2. Adicionar a nova constraint com CASCADE
ALTER TABLE messages 
ADD CONSTRAINT messages_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Agora, quando um produto for deletado, todas as mensagens relacionadas serão deletadas automaticamente
