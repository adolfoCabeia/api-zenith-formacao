import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Usuario
 *
 */
export type Usuario = Prisma.UsuarioModel;
/**
 * Model Curso
 *
 */
export type Curso = Prisma.CursoModel;
/**
 * Model Turma
 *
 */
export type Turma = Prisma.TurmaModel;
/**
 * Model Aluno
 *
 */
export type Aluno = Prisma.AlunoModel;
/**
 * Model Pagamento
 *
 */
export type Pagamento = Prisma.PagamentoModel;
/**
 * Model BlacklistedToken
 *
 */
export type BlacklistedToken = Prisma.BlacklistedTokenModel;
/**
 * Model refreshToken
 *
 */
export type refreshToken = Prisma.refreshTokenModel;
//# sourceMappingURL=client.d.ts.map