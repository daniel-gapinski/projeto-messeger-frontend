import RegisterPage from "../containers/RegisterPage";
import Button from "./Button";
import Container from "./Container";
import Input from "./Input";

export default function FormRegisterBox() {
    return (
        <>
            <div className="w-full max-w-132 bg-white mx-auto rounded-2xl px-6 py-5">
                <Container>
                    <div className="w-full flex flex-col gap-6 h-full text-gray">
                        <div className="w-full flex flex-col items-center gap-2">
                            <h2 className="text-primary text-xl font-semibold">Vamos começar!</h2>
                            <p className="text-sm">Insira seu e-mail, nome de usuário e senha para entrar</p>
                        </div>

                        <RegisterPage>
                            {({ email, setEmail, password, setPassword, username, setUsername, handleRegister, errorFields }) => (
                                <>
                                    <Input
                                        label="Nome de usuário"
                                        name={username}
                                        type="text"
                                        placeholder="exemplo"
                                        value={username}
                                        error={errorFields.username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />

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
                                            name="Registrar"
                                            onClick={handleRegister}
                                            type="button"
                                        />
                                    </div>
                                </>
                            )}
                        </RegisterPage>

                        <div className="w-full flex items-center justify-center mt-3 gap-1 text-[12px]">
                            <p>
                                Já possui conta?
                            </p>
                            <a className="text-primary hover:text-primary-hover" href="/login">Entrar</a>
                        </div>

                    </div>
                </Container>
            </div>
        </>
    )
}