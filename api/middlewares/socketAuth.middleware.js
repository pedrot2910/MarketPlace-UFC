export const socketAuthMiddleware = async (socket, next) => {
  
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Acesso negado: Token não fornecido."));
  }

  try {
    // Em produção, aqui você validaria o JWT localmente com a sua SECRET
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new Error("Acesso negado: Token inválido."));
    }

    socket.data.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error("Erro crítico no Socket Auth:", err);
    next(new Error("Erro de servidor na autenticação."));
  }
};