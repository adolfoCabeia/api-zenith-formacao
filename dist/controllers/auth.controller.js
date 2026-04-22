import AuthService from "../services/auth.service.js";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
};
class AuthController {
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;
            if (!nome || !email || !senha) {
                return res.status(400).json({ message: "Dados incompletos" });
            }
            const result = await AuthService.register(nome, email, senha, res);
            res.status(201).json({
                message: "Usuário criado com sucesso",
                user: result.user,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ message: "Dados incompletos" });
            }
            const result = await AuthService.login(email, senha, res);
            res.json({
                message: "Login realizado com sucesso",
                user: result.user,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async refresh(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token não fornecido" });
            }
            const result = await AuthService.refresh(refreshToken, res);
            res.json({ message: result.message });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async logout(req, res) {
        try {
            await AuthService.logout(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async profile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Não autorizado" });
            }
            const user = await AuthService.getProfile(userId);
            res.json({ user });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Não autorizado" });
            }
            const { nome, email } = req.body;
            const user = await AuthService.updateProfile(userId, { nome, email });
            res.json({
                message: "Perfil atualizado com sucesso",
                user,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updatePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Não autorizado" });
            }
            const { senhaAtual, novaSenha } = req.body;
            if (!senhaAtual || !novaSenha) {
                return res.status(400).json({ message: "Dados incompletos" });
            }
            const result = await AuthService.updatePassword(userId, { senhaAtual, novaSenha });
            res.clearCookie("accessToken", COOKIE_OPTIONS);
            res.clearCookie("refreshToken", COOKIE_OPTIONS);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default new AuthController();
//# sourceMappingURL=auth.controller.js.map