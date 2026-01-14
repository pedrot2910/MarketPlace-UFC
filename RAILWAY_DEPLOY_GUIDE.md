# 🚀 Guia de Deploy no Railway

## Problema Identificado no Log

O erro no Railway foi:

```
Error: Cannot find module '/app/src/server.js'
> node src/server.js
```

O Railway estava tentando executar `node src/server.js` mas o arquivo correto é `server.js`.

## ✅ Correções Aplicadas

1. **package.json** - Adicionados campos obrigatórios:

   - `name`: "marketplace-ufc-api"
   - `version`: "1.0.0"
   - `main`: "server.js"
   - `scripts.start`: "node server.js"

2. **railway.json** - Criado arquivo de configuração forçando:
   - Builder: NIXPACKS
   - Start Command: `npm start`
   - Restart Policy: ON_FAILURE

## 📋 Checklist para Deploy no Railway

### 1. Configurar Variáveis de Ambiente no Railway

No dashboard do Railway, adicione estas variáveis:

```bash
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase
PORT=3000
NODE_ENV=production
```

### 2. Estrutura de Arquivos Necessária

```
api/
├── server.js              ✅ Arquivo principal
├── package.json           ✅ Com name, version, main
├── railway.json           ✅ Configuração do Railway
├── .env                   ⚠️ NÃO fazer commit (apenas local)
├── controllers/
├── middlewares/
├── routes/
├── services/
└── sockets/
```

### 3. Root Directory no Railway

No Railway, configure:

- **Root Directory**: `api`
- **Start Command**: (será pego do package.json automaticamente)

### 4. Fazer o Deploy

```bash
# Na pasta raiz do projeto
git add .
git commit -m "fix: corrigir configuração do Railway"
git push
```

O Railway vai:

1. Detectar Node.js
2. Executar `npm install`
3. Executar `npm start` (que roda `node server.js`)

### 5. Verificar Logs

No Railway Dashboard:

1. Clique no serviço
2. Vá em "Deployments"
3. Clique no deployment ativo
4. Veja os logs em tempo real

## ⚠️ Problemas Comuns

### Erro: Cannot find module

- **Causa**: Caminho errado no package.json
- **Solução**: Verificar que `start` está como `"node server.js"`

### Erro: Port already in use

- **Causa**: PORT hardcoded no código
- **Solução**: Usar `process.env.PORT || 3000`

### Erro: Supabase connection failed

- **Causa**: Variáveis de ambiente não configuradas
- **Solução**: Adicionar SUPABASE_URL e SUPABASE_KEY no Railway

### Erro: CORS issues

- **Causa**: Frontend não está na lista de origins permitidas
- **Solução**: No server.js, configurar CORS:

```javascript
app.use(
  cors({
    origin: ['https://seu-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);
```

## 🔍 Testando o Deploy

Após o deploy bem-sucedido:

1. O Railway vai fornecer uma URL como: `https://seu-app.railway.app`
2. Teste a rota base:

```bash
curl https://seu-app.railway.app/
# Deve retornar: "Backend do Marketplace está on! 🚀"
```

3. Teste uma rota da API:

```bash
curl https://seu-app.railway.app/api/categories
```

## 📝 Próximos Passos

1. ✅ Fazer commit das mudanças
2. ✅ Push para o repositório
3. ✅ Configurar variáveis de ambiente no Railway
4. ✅ Aguardar o deploy
5. ✅ Testar as rotas
6. ✅ Atualizar o frontend com a nova URL do backend

## 🆘 Se ainda houver erros

Baixe os logs novos do Railway e me mostre para investigar!
