import supabase from "../supabase.js";

/**
 * Middleware de autenticação para Socket.IO
 * Valida o token no handshake e injeta o usuário no socket.
 */
export async function socketAuthMiddleware(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token de autenticação não fornecido."));
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new Error("Token inválido ou expirado."));
    }

    // Injeta o usuário autenticado no socket
    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Erro interno na autenticação do socket."));
  }
}
