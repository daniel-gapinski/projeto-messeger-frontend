export class AuthTokenError extends Error {
    constructor() {
        super("Erro ao autenticar token");
    }
}