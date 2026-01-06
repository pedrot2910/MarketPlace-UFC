import supabase from '../supabase.js';

const authService = {
    // 1. CADASTRO (Sign Up)
    signUp: async (email, password, name, matricula, role) => {
        
        // A. Cria login seguro
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw new Error(authError.message);

        // B. Cria perfil público (Se o login deu certo)
        if (authData.user) {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id, // Conecta as duas tabelas
                        email,
                        name,
                        matricula,
                        role
                    }
                ])
                .select();

            if (profileError) throw new Error(`Erro ao criar perfil: ${profileError.message}`);

            return { user: authData.user, profile: profileData[0] };
        }
    },

    // 2. LOGIN (Sign In)
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error('Email ou senha incorretos.');

        return {
            token: data.session.access_token,
            user: data.user
        };
    }
};

export { authService };