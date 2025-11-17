import { useState, useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/ToastNotification";

interface LoginPageProps {
  children: (props: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: () => void;
    loading: boolean;
    setLoading: (load: boolean) => void;
    errorFields: { email: boolean, password: boolean };
  }) => ReactNode;
}

export default function LoginPage({ children }: LoginPageProps) {

    const { SignIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorFields, setErrorFields] = useState({email: false, password: false});

    async function handleLogin() {
        setErrorFields({ email: false, password: false });

        let emailEmpty = email.trim() === "";
        let passwordEmpty = password.trim() === "";

        if(emailEmpty || passwordEmpty) {
            notify.error("Preencha todos os campos!");
            setErrorFields({email: emailEmpty, password: passwordEmpty});
            return;
        }

        try {
            await SignIn({
                email,
                password,
            });
            navigate("/")

        } catch (err) {
            console.log("erro ao logar", err);
            notify.error("E-mail ou senha incorretos!");
            setErrorFields({email: true, password: true });
            setLoading(false);
        }
    }

    return children({
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        loading,
        setLoading,
        errorFields,
    });
}