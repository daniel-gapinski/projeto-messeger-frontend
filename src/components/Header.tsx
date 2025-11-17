import { useLocation } from "react-router-dom";
import Container from "./Container";

export default function Header() {

    const location = useLocation();
    let currentPath = location.pathname;

    let isLoginPage = currentPath === "/login";
    
    return (
        <>
            <div className="w-full bg-white h-16 flex justify-center items-center">
                <Container>
                    <div className="flex w-full justify-between p-2 items-center">
                        <div className="text-primary p-1">
                            <h2 className="text-xl">CHATDESK</h2>
                        </div>
                        <div className="text-primary text-[12px]">
                            <a href={isLoginPage ? "/register" : "/login"}>
                                <button className="bg-primary text-white py-1 px-2 rounded-md hover:bg-primary-hover cursor-pointer">
                                    {isLoginPage ? "Criar conta" : "Entrar"}
                                </button>
                            </a>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}