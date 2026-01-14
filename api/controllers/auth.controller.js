import { authService } from "../services/auth.service.js";

const authController = {
  // 1. CADASTRO (Sign Up)
  signUp: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      const result = await authService.signUp(email, password, name, role);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // 2. LOGIN (Sign In)
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.signIn(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export { authController };
