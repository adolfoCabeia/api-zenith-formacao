export declare const cursoTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id?: undefined;
            nome?: undefined;
            preco?: undefined;
        };
        required: never[];
    };
    handler: () => Promise<{
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
    required?: undefined;
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
            nome?: undefined;
            preco?: undefined;
        };
        required: string[];
    };
    handler: (input: ({
        id: "string";
    })) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
    required?: undefined;
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
            preco: {
                type: string;
                description: string;
                minimum: number;
            };
            id?: undefined;
        };
        required: string[];
    };
    handler: (input: ({
        nome: string;
        preco: number;
    })) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
    required?: undefined;
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
            nome: {
                type: string;
                description: string;
            };
            preco: {
                type: string;
                description: string;
                minimum?: undefined;
            };
        };
        required: string[];
    };
    handler: (input: ({
        id: string;
        nome?: string;
        preco?: number;
    })) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
    required?: undefined;
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
            nome?: undefined;
            preco?: undefined;
        };
        required?: undefined;
    };
    required: string[];
    handler: (input: {
        id: string;
    }) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError: boolean;
    }>;
})[];
//# sourceMappingURL=cursoTools.d.ts.map