import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cria a conexão
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta a conexão para usar em outros arquivos
export default supabase;
