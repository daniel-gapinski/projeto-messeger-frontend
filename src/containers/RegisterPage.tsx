import { useState, useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/ToastNotification";

interface RegisterPageProps {
    children: (props: {
        email: string;
        setEmail: (email: string) => void;
        password: string;
        setPassword: (password: string) => void;
        username: string;
        setUsername: (username: string) => void;
        handleRegister: () => void;
        loading: boolean;
        setLoading: (load: boolean) => void;
        errorFields: { email: boolean, password: boolean, username: boolean };
    }) => ReactNode;
}

export default function RegisterPage({ children }: RegisterPageProps) {

    const { SignUp } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorFields, setErrorFields] = useState({ email: false, password: false, username: false });

    async function handleRegister() {
        setErrorFields({ email: false, password: false, username: false });

        let emailEmpty = email.trim() === "";
        let passwordEmpty = password.trim() === "";
        let usernameEmpty = username.trim() === "";

        if (emailEmpty || passwordEmpty) {
            setErrorFields({ email: emailEmpty, password: passwordEmpty, username: usernameEmpty });
            notify.error("Preencha todos os campos!");
            return;
        }

        const registerPromise = new Promise(async (resolve, reject) => {
            try {
                await SignUp({ email, password, username });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });

        notify.promise(registerPromise, {
            loading: "Criando usuário",
            success: "Usuário criado com sucesso!",
            error: () => "E-mail ou nome de usuário já existente!",
        });

        try {
            await registerPromise;
            navigate("/login");

        } catch (err) {
            setErrorFields({ email: true, username: true, password: true })
            console.log("Erro ao registrar", err);
        }
    }

    return children({
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        handleRegister,
        loading,
        setLoading,
        errorFields,
    });
}