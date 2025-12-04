import express from 'express';
import cors from 'cors';
import supabase from './supabase.js';
import router from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Conexão com o Supabase estabelecida com sucesso!');

app.get('/', (req, res) => {
  res.send('Backend do Marketplace está on! 🚀');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
