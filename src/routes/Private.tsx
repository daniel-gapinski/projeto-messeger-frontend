import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


interface PrivateProps {
    children: ReactNode;
}

export default function Private({ children }: PrivateProps) {

    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        console.log("Você não está autenticado!");

        return (
            <Navigate to={"/login"} />
        )
    }

    return children;
}