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
          token: result.token,
          authenticated: true,
          email: email 
        });

        return {
          content: [{
            type: 'text',
            text: `Login bem-sucedido! Token guardado na sessão.`
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
        nome: { type: 'string' },
        email: { type: 'string' },
        senha: { type: 'string' },
        _sessionId: { type: 'string' },
      },
      required: ['nome', 'email', 'senha'],
    },
    handler: async ({ nome, email, senha }: any) => {
      try {
        const result = await AuthService.register(nome, email, senha);
        return {
          content: [{
            type: 'text',
            text: `Usuário ${result.user.nome} registrado com sucesso! ID: ${result.user.id}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Erro: ${error.message}`
          }],
          isError: true
        };
      }
    }
  },

  {
    name: 'get_session_info',
    description: 'Retorna informações da sessão atual',
    inputSchema: {
      type: 'object',
      properties: {
        _sessionId: { type: 'string' },
      },
    },
    handler: async ({ getContext }: any) => {
      const ctx = getContext();
      return {
        content: [{
          type: 'text',
          text: ctx.authenticated 
            ? `Sessão ativa: ${ctx.email}`
            : `Sessão anônima`
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
        _sessionId: { type: 'string' },
      },
    },
    handler: async ({ setContext }: any) => {
      setContext({ authenticated: false, token: null, email: null });
      return {
        content: [{
          type: 'text',
          text: `Logout realizado com sucesso.`
        }]
      };
    }
  }
];