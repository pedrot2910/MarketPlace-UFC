import supabase from "../supabase.js";
import { appError } from "../utils/appError.utils.js";

function generateMatricula() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateUniqueMatricula() {
  for (let i = 0; i < 5; i++) {
    const matricula = generateMatricula();

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("matricula", matricula)
      .maybeSingle();

    if (!data) return matricula;
  }

  throw new appError("Falha ao gerar matrícula única");
}

const authService = {
  // 1. CADASTRO (Sign Up)
  signUp: async (body) => {
    const { email, password, name, role } = body;
    // A. Cria login seguro
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new appError(authError.message, 400);

    // B. Cria perfil público (Se o login deu certo)
    if (authData.user) {
      const matricula = await generateUniqueMatricula();

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id, // Conecta as duas tabelas
            email,
            name,
            matricula,
            role,
          },
        ])
        .select();

      if (profileError)
        throw new appError(`Erro ao criar perfil: ${profileError.message}`, 500);

      return { user: authData.user, profile: profileData[0] };
    }
  },

  // 2. LOGIN (Sign In)
  signIn: async (body) => {
    const { email, password } = body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new appError("Email ou senha incorretos.", 400);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      throw new appError("Erro ao buscar perfil.", 500);
    }

    return {
      token: data.session.access_token,
      user: data.user,
      profile,
    };
  },
};

export { authService };
