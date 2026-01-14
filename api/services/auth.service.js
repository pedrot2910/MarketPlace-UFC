import supabase from "../supabase.js";

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

  throw new Error("Falha ao gerar matrícula única");
}

const authService = {
  // 1. CADASTRO (Sign Up)
  signUp: async (email, password, name, role) => {
    // A. Cria login seguro
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

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
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);

      return { user: authData.user, profile: profileData[0] };
    }
  },

  // 2. LOGIN (Sign In)
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error("Email ou senha incorretos.");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      throw new Error("Erro ao buscar perfil.");
    }

    return {
      token: data.session.access_token,
      user: data.user,
      profile,
    };
  },
};

export { authService };
