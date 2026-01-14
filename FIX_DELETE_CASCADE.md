# Correção: Erro ao deletar anúncios com mensagens de chat

## Problema
Não era possível deletar anúncios que tinham mensagens de chat associadas devido à falta de `ON DELETE CASCADE` nas foreign keys.

## Solução Implementada

### 1. Migration SQL
Execute o arquivo `migration_fix_delete_cascade.sql` no seu banco de dados Supabase:

```bash
# Via Supabase Dashboard:
# 1. Acesse seu projeto no Supabase
# 2. Vá em SQL Editor
# 3. Cole o conteúdo do arquivo migration_fix_delete_cascade.sql
# 4. Execute
```

### 2. Código Melhorado
O arquivo `api/services/product.service.js` foi atualizado para:
- Deletar mensagens relacionadas ao produto
- Deletar relatórios relacionados ao produto
- Deletar favoritos relacionados ao produto
- Deletar imagens do produto
- Deletar o produto
- Melhor tratamento de erros com logs detalhados

### 3. Schema Atualizado
O arquivo `schema.sql` foi atualizado para incluir `ON DELETE CASCADE` nas tabelas:
- `messages` (sender_id, receiver_id, product_id)
- `reports` (reporter_id, product_id)

## Como Testar

1. Aplique a migration no banco de dados
2. Reinicie o servidor Node.js:
   ```bash
   cd api
   npm start
   ```
3. Tente deletar um anúncio que tem mensagens associadas
4. O anúncio deve ser deletado com sucesso junto com todas as mensagens relacionadas

## O que foi corrigido

✅ Mensagens de chat são deletadas automaticamente quando o produto é deletado  
✅ Relatórios são deletados quando o produto é deletado  
✅ Favoritos são deletados quando o produto é deletado (já estava)  
✅ Imagens são deletadas quando o produto é deletado (já estava)  
✅ Melhor tratamento de erros com logs  

## Nota Importante
Se o banco de dados já está rodando, você **DEVE** executar a migration `migration_fix_delete_cascade.sql` para corrigir as constraints existentes.
