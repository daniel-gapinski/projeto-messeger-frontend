import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/apiClient";
import { connectSocket, disconnectSocket } from "../socket/Socket";

interface AuthContextData {
    isAuthenticated: boolean;
    user: UserProps | undefined;
    loading: boolean;
    SignIn: (credentials: SignInProps) => void;
    SignUp: (credentials: SignUpProps) => void;
    loggoutUser: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface SignInProps {
    email: string;
    password: string;
}

interface SignUpProps {
    email: string;
    password: string;
    username: string;
}

interface UserProps {
    id: string;
    name: string;
    username: string;
    email: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        const { "@messeger.token": token } = parseCookies();

        if (!token) {
            setLoading(false);
            return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        api.get("/me")
            .then((response) => {
                const { id, name, username, email } = response.data;

                setUser({
                    id,
                    name,
                    username,
                    email
                });

                connectSocket(token);
            }).catch((err) => {
                setUser(undefined);
                throw err;

            }).finally(() => setLoading(false));

        return () => {

        }
    }, []);

    async function SignIn({ email, password }: SignInProps) {
        try {
            const response = await api.post("/session", {
                email,
                password
            });

            const { id, name, username, email: userEmail, token } = response.data;

            setUser({
                id,
                name,
                username,
                email: userEmail
            });

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            connectSocket(token);

            setCookie(undefined, "@messeger.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: "/",
            });

        } catch (err) {
            throw err;
        }
    }

    async function SignUp({ username, email, password }: SignUpProps) {
        try {
            await api.post("/register", {
                username,
                email,
                password
            });

        } catch (err) {
            throw (err);

        }
    }

    async function loggoutUser() {
        try {
            destroyCookie(null, "@messeger.token", { path: "/" });
            setUser(undefined);
            disconnectSocket();
        }catch(err){
            console.error("Erro ao deslogar!");
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            SignIn,
            SignUp,
            loggoutUser,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
