export declare const alunoTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            nome: {
                type: string;
            };
            email: {
                type: string;
            };
            telefone: {
                type: string;
            };
            curso: {
                type: string;
            };
            biUrl: {
                type: string;
            };
            comprovativoUrl: {
                type: string;
            };
        };
        required: string[];
    };
    handler: (input: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            nome?: never;
            email?: never;
            telefone?: never;
            curso?: never;
            biUrl?: never;
            comprovativoUrl?: never;
        };
        required?: never;
    };
    handler: () => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
})[];
//# sourceMappingURL=alunoTools.d.ts.map