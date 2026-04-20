export declare const authTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            email: {
                type: string;
                description: string;
            };
            senha: {
                type: string;
                description: string;
            };
            _sessionId: {
                type: string;
                description: string;
            };
            nome?: undefined;
            senhaAtual?: undefined;
            novaSenha?: undefined;
        };
        required: string[];
    };
    handler: ({ email, senha, setContext }: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            nome: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
            };
            senha: {
                type: string;
                description: string;
            };
            _sessionId: {
                type: string;
                description: string;
            };
            senhaAtual?: undefined;
            novaSenha?: undefined;
        };
        required: string[];
    };
    handler: ({ nome, email, senha }: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            nome: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
            };
            _sessionId: {
                type: string;
                description: string;
            };
            senha?: undefined;
            senhaAtual?: undefined;
            novaSenha?: undefined;
        };
        required?: undefined;
    };
    handler: ({ nome, email, getContext, setContext }: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            senhaAtual: {
                type: string;
                description: string;
            };
            novaSenha: {
                type: string;
                description: string;
            };
            _sessionId: {
                type: string;
                description: string;
            };
            email?: undefined;
            senha?: undefined;
            nome?: undefined;
        };
        required: string[];
    };
    handler: ({ senhaAtual, novaSenha, getContext }: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            _sessionId: {
                type: string;
                description: string;
            };
            email?: undefined;
            senha?: undefined;
            nome?: undefined;
            senhaAtual?: undefined;
            novaSenha?: undefined;
        };
        required?: undefined;
    };
    handler: ({ getContext }: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
})[];
//# sourceMappingURL=authTools.d.ts.map