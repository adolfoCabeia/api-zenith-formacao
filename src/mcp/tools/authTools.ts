import AuthService from '../../services/auth.service.js';

export const authTools = [
  {
    name: 'login',
    description: 'Autentica um usuário e retorna token JWT',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email do usuário' },
        senha: { type: 'string', description: 'Senha do usuário' },
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
      required: ['email', 'senha'],
    },
    handler: async ({ email, senha, setContext }: any) => {
      try {
        const result = await AuthService.login(email, senha);

        setContext({
          token: result.accessToken, 
          userId: result.user.id,
          userName: result.user.nome,
          userEmail: result.user.email,
          authenticated: true,
        });

        return {
          content: [{
            type: 'text',
            text: `Login bem-sucedido!\n\n Usuário: ${result.user.nome}\n Email: ${result.user.email}\n ID: ${result.user.id}\n\nToken guardado na sessão.`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Erro de login: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'register',
    description: 'Registra um novo usuário no sistema',
    inputSchema: {
      type: 'object',
      properties: {
        nome: { type: 'string', description: 'Nome do usuário' },
        email: { type: 'string', description: 'Email do usuário' },
        senha: { type: 'string', description: 'Senha do usuário' },
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
      required: ['nome', 'email', 'senha'],
    },
    handler: async ({ nome, email, senha }: any) => {
      try {
        const result = await AuthService.register(nome, email, senha);
        return {
          content: [{
            type: 'text',
            text: `Usuário registrado com sucesso!\n\n Nome: ${result.user.nome}\n Email: ${result.user.email}\n ID: ${result.user.id}\n Criado em: ${result.user.createdAt}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Erro no registro: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'get_profile',
    description: 'Retorna o perfil do usuário logado',
    inputSchema: {
      type: 'object',
      properties: {
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
    },
    handler: async ({ getContext }: any) => {
      const ctx = getContext();

      if (!ctx.authenticated || !ctx.userId) {
        return {
          content: [{
            type: 'text',
            text: `Você não está autenticado. Use a ferramenta 'login' primeiro.`
          }],
          isError: true
        };
      }

      try {
        const profile = await AuthService.getProfile(ctx.userId);
        return {
          content: [{
            type: 'text',
            text: `Perfil do Usuário:\n\n ID: ${profile.id}\n Nome: ${profile.nome}\n Email: ${profile.email}\n Criado em: ${profile.createdAt}\n Atualizado em: ${profile.updatedAt}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Erro ao buscar perfil: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'update_profile',
    description: 'Atualiza o nome e/ou email do usuário logado',
    inputSchema: {
      type: 'object',
      properties: {
        nome: { type: 'string', description: 'Novo nome (opcional)' },
        email: { type: 'string', description: 'Novo email (opcional)' },
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
    },
    handler: async ({ nome, email, getContext, setContext }: any) => {
      const ctx = getContext();

      if (!ctx.authenticated || !ctx.userId) {
        return {
          content: [{
            type: 'text',
            text: `Você não está autenticado. Use a ferramenta 'login' primeiro.`
          }],
          isError: true
        };
      }

      if (!nome && !email) {
        return {
          content: [{
            type: 'text',
            text: `Informe pelo menos um campo para atualizar (nome ou email).`
          }],
          isError: true
        };
      }

      try {
        const updateData: { nome?: string; email?: string } = {};
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;

        const updated = await AuthService.updateProfile(ctx.userId, updateData);

        if (email) {
          setContext({ ...ctx, userEmail: email, userName: nome || ctx.userName });
        } else if (nome) {
          setContext({ ...ctx, userName: nome });
        }

        return {
          content: [{
            type: 'text',
            text: `Perfil atualizado com sucesso!\n\n Nome: ${updated.nome}\n Email: ${updated.email}\n🔄 Atualizado em: ${updated.updatedAt}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Erro ao atualizar perfil: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'change_password',
    description: 'Altera a senha do usuário logado',
    inputSchema: {
      type: 'object',
      properties: {
        senhaAtual: { type: 'string', description: 'Senha atual' },
        novaSenha: { type: 'string', description: 'Nova senha (mínimo 6 caracteres)' },
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
      required: ['senhaAtual', 'novaSenha'],
    },
    handler: async ({ senhaAtual, novaSenha, getContext }: any) => {
      const ctx = getContext();

      if (!ctx.authenticated || !ctx.userId) {
        return {
          content: [{
            type: 'text',
            text: `Você não está autenticado. Use a ferramenta 'login' primeiro.`
          }],
          isError: true
        };
      }

      if (novaSenha.length < 6) {
        return {
          content: [{
            type: 'text',
            text: `A nova senha deve ter pelo menos 6 caracteres.`
          }],
          isError: true
        };
      }

      try {
        const result = await AuthService.updatePassword(ctx.userId, {
          senhaAtual,
          novaSenha
        });

        return {
          content: [{
            type: 'text',
            text: `${result.message}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `❌ Erro ao alterar senha: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'get_session_info',
    description: 'Retorna informações detalhadas da sessão atual',
    inputSchema: {
      type: 'object',
      properties: {
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
    },
    handler: async ({ getContext }: any) => {
      const ctx = getContext();

      if (!ctx.authenticated) {
        return {
          content: [{
            type: 'text',
            text: `Sessão Anônima\n\nVocê não está autenticado.\nUse a ferramenta 'login' para entrar no sistema.`
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Sessão Ativa\n\n👤 Nome: ${ctx.userName || 'N/A'}\n📧 Email: ${ctx.userEmail || 'N/A'}\n🆔 User ID: ${ctx.userId || 'N/A'}\n🔑 Token: ${ctx.token ? ctx.token.substring(0, 20) + '...' : 'N/A'}`
        }]
      };
    }
  },

  {
    name: 'logout',
    description: 'Encerra a sessão atual',
    inputSchema: {
      type: 'object',
      properties: {
        _sessionId: { type: 'string', description: 'ID da sessão (interno)' },
      },
    },
    handler: async ({ getContext, setContext }: any) => {
      const ctx = getContext();

      if (!ctx.authenticated) {
        return {
          content: [{
            type: 'text',
            text: `Nenhuma sessão ativa para encerrar.`
          }]
        };
      }

      const userName = ctx.userName || ctx.userEmail || 'Usuário';

      setContext({
        authenticated: false,
        token: null,
        userId: null,
        userName: null,
        userEmail: null
      });

      return {
        content: [{
          type: 'text',
          text: `Logout realizado com sucesso!\n\nAté logo, ${userName}.`
        }]
      };
    }
  }
];