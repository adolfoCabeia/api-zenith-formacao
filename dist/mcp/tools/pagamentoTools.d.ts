export declare const pagamentoTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id?: undefined;
            alunoId?: undefined;
            valor?: undefined;
            status?: undefined;
            data?: undefined;
        };
        required: never[];
    };
    handler: (args: any, extra: any) => Promise<{
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
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            alunoId?: undefined;
            valor?: undefined;
            status?: undefined;
            data?: undefined;
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
        type: string;
        properties: {
            alunoId: {
                type: string;
                description: string;
            };
            valor: {
                type: string;
                description: string;
                minimum: number;
            };
            status: {
                type: string;
                description: string;
                enum: string[];
            };
            data: {
                type: string;
                description: string;
                format: string;
            };
            id?: undefined;
        };
        required: string[];
    };
    handler: (input: {
        alunoId: string;
        valor: number;
        status: string;
        data?: string;
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
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            valor: {
                type: string;
                description: string;
                minimum: number;
            };
            status: {
                type: string;
                description: string;
                enum: string[];
            };
            data: {
                type: string;
                description: string;
                format: string;
            };
            alunoId?: undefined;
        };
        required: string[];
    };
    handler: (input: {
        id: string;
        valor?: number;
        status?: string;
        data?: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
})[];
//# sourceMappingURL=pagamentoTools.d.ts.map