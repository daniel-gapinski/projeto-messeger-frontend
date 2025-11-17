import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function Loggout() {

    const { loggoutUser } = useContext(AuthContext);

    return (
        <div className="w-42 bg-white border border-red-100 mt-50 l-20 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4">
            <p className="text-gray-700 text-center text-sm">
                Tem certeza que deseja sair da sua conta?
            </p>

            <button
                onClick={() => loggoutUser()}
                className="w-full cursor-pointer px-5 py-3 rounded-2xl bg-red-100 text-red-500 font-medium hover:bg-red-200 transition"
            >
                Sair
            </button>
        </div>
    );
}
