import { useContext, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { X } from "lucide-react";
import { FriendsContext } from "../contexts/FriendsContext";
import { notify } from "./ToastNotification";

export function AddFriendsModal() {
    const { closeModal } = useContext(ModalContext);
    const { addFriend } = useContext(FriendsContext);
    const [email, setEmail] = useState("");

    const handleAddFriend = async () => {

        if (!email.trim()) {
            notify.error("Insira um e-mail válido!");
            return;
        }

         const addPromise = addFriend(email);

        notify.promise(addPromise, {
            loading: "Enviando pedido...",
            success: "Pedido enviado com sucesso!",
            error: (err) => err?.response?.data?.message || err?.message || "Erro ao enviar pedido",
        });

        try {
            await addPromise;

            setEmail("");
            closeModal();
        } catch {
            setEmail("");
        }
    };

    return (
        <div className="w-full h-full bg-white flex flex-col animate-fadeIn rounded-2xl overflow-hidden">
            <header className="flex items-center justify-between px-5 py-3 border-b border-dark-gray bg-white">
                <h2 className="text-xl font-semibold text-primary tracking-tight select-none">
                    Adicionar amigo
                </h2>
                <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </header>

            <section className="px-5 py-5 flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Digite o email do amigo"
                    className="w-full h-10 rounded-xl bg-white-bg text-sm px-4 text-gray placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={closeModal}
                        className="px-5 cursor-pointer py-2 rounded-2xl border border-gray-300 text-gray hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAddFriend}
                        className="px-5 py-2 cursor-pointer rounded-2xl bg-primary text-white hover:bg-primary-hover transition"
                    >
                        Enviar pedido
                    </button>
                </div>
            </section>
        </div>
    );
}
