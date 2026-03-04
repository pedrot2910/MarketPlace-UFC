import { authService } from "../services/auth.service.js";

const authController = {
  // 1. CADASTRO (Sign Up)
  signUp: async (req, res, next) => {
    try {

      const result = await authService.signUp(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  
  // 2. LOGIN (Sign In)
  signIn: async (req, res, next) => {
    try {
      const result = await authService.signIn(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export { authController };
