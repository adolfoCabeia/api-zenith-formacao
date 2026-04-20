export declare const turmaTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id?: undefined;
            cursoId?: undefined;
            diaSemana?: undefined;
            horario?: undefined;
            dataInicio?: undefined;
            dataFim?: undefined;
            capacidade?: undefined;
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
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            cursoId?: undefined;
            diaSemana?: undefined;
            horario?: undefined;
            dataInicio?: undefined;
            dataFim?: undefined;
            capacidade?: undefined;
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
        type: string;
        properties: {
            cursoId: {
                type: string;
                description: string;
            };
            diaSemana: {
                type: string;
                description: string;
                items: {
                    type: string;
                    enum: string[];
                };
                example: string[];
            };
            horario: {
                type: string;
                description: string;
            };
            dataInicio: {
                type: string;
                description: string;
                format: string;
            };
            dataFim: {
                type: string;
                description: string;
                format: string;
            };
            capacidade: {
                type: string;
                description: string;
                minimum: number;
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
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            cursoId: {
                type: string;
                description: string;
            };
            diaSemana: {
                type: string;
                items: {
                    type: string;
                    enum?: undefined;
                };
                description: string;
                example?: undefined;
            };
            horario: {
                type: string;
                description: string;
            };
            dataInicio: {
                type: string;
                description: string;
                format: string;
            };
            dataFim: {
                type: string;
                description: string;
                format: string;
            };
            capacidade: {
                type: string;
                description: string;
                minimum: number;
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
    } | {
        content: {
            type: string;
            text: string;
        }[];
    }>;
})[];
//# sourceMappingURL=turmaTools.d.ts.map