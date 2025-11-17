import LoginPage from "../containers/LoginPage";
import Button from "./Button";
import Container from "./Container";
import Input from "./Input";

export default function FormBox() {
    return (
        <>
            <div className="w-full max-w-122 bg-white mx-auto rounded-2xl px-6 py-5">
                <Container>
                    <div className="w-full flex flex-col gap-6 h-full text-gray">
                        <div className="w-full flex flex-col items-center gap-2">
                            <h2 className="text-primary text-xl font-semibold">Olá, bem-vindo novamente!</h2>
                            <p className="text-sm">Insira seu e-mail e senha para entrar</p>
                        </div>

                        <LoginPage>
                            {({ email, setEmail, password, setPassword, handleLogin, errorFields }) => (
                                <>
                                    <Input
                                        label="E-mail"
                                        name={email}
                                        type="email"
                                        placeholder="exemplo@exemplo.com"
                                        value={email}
                                        error={errorFields.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <Input
                                        label="Senha"
                                        name={password}
                                        type="password"
                                        placeholder="Senha"
                                        value={password}
                                        error={errorFields.password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <div className="mt-4">
                                        <Button
                                            name="Entrar"
                                            onClick={handleLogin}
                                            type="button"
                                        />
                                    </div>
                                </>
                            )}
                        </LoginPage>

                        <div className="w-full flex items-center justify-center mt-3 gap-1 text-[12px]">
                            <p>
                                Não possui conta?
                            </p>
                            <a className="text-primary hover:text-primary-hover" href="/register">Criar agora</a>
                        </div>

                    </div>
                </Container>
            </div>
        </>
    )
}