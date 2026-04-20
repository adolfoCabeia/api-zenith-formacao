export declare const alunoTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id?: undefined;
            nome?: undefined;
            email?: undefined;
            telefone?: undefined;
            turmaId?: undefined;
            biUrl?: undefined;
            comprovativoUrl?: undefined;
            status?: undefined;
        };
        required: never[];
    };
    handler: (args: any, extra: any) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    } | {
        content: {
            type: string;
            text: string;
        }[];
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
            nome?: undefined;
            email?: undefined;
            telefone?: undefined;
            turmaId?: undefined;
            biUrl?: undefined;
            comprovativoUrl?: undefined;
            status?: undefined;
        };
        required: string[];
    };
    handler: (input: {
        id: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            nome: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
            };
            telefone: {
                type: string;
                description: string;
            };
            turmaId: {
                type: string;
                description: string;
            };
            biUrl: {
                type: string;
                description: string;
            };
            comprovativoUrl: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            id?: undefined;
        };
        required: string[];
    };
    handler: (input: any) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
            nome: {
                type: string;
                description?: undefined;
            };
            email: {
                type: string;
                description?: undefined;
            };
            telefone: {
                type: string;
                description?: undefined;
            };
            turmaId: {
                type: string;
                description?: undefined;
            };
            biUrl: {
                type: string;
                description: string;
            };
            comprovativoUrl: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description?: undefined;
            };
        };
        required: string[];
    };
    handler: (input: any) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
})[];
//# sourceMappingURL=alunoTools.d.ts.map