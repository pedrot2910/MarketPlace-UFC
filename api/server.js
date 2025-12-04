import express from 'express';
import cors from 'cors';
import supabase from './supabase.js';
import router from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


console.log('Conexão com o Supabase estabelecida com sucesso!');

app.get('/', (req, res) => {
  res.send('Backend do Marketplace está on! 🚀');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
