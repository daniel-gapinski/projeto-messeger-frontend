import { useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { X } from "lucide-react";
import { FriendsContext } from "../contexts/FriendsContext";

export default function AcceptFriendModal() {
    const { closeModal } = useContext(ModalContext);
    const { pendingRequests, acceptFriendRequest, rejectFriendRequest } = useContext(FriendsContext);

    return (
        <div className="w-full max-w-md h-full bg-white flex flex-col animate-fadeIn rounded-2xl overflow-hidden">
            <header className="flex items-center justify-between px-5 py-3 border-b border-dark-gray bg-white">
                <h2 className="text-xl font-semibold text-primary tracking-tight select-none">
                    Pedidos de amizade
                </h2>
                <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </header>

            <section className="px-5 py-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                {pendingRequests.map((request) => (
                    <div
                        key={request.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white-bg rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-semibold text-primary capitalize">{request.requester?.username}</span>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <button 
                                onClick={() => rejectFriendRequest(request.id)}
                                className="px-3 py-1 rounded-xl border cursor-pointer border-red-300 text-red-500 hover:bg-red-50 transition">
                                Recusar
                            </button>
                            <button 
                                onClick={() => acceptFriendRequest(request.id)}
                                className="px-3 py-1 rounded-xl cursor-pointer bg-primary text-white hover:bg-primary-hover transition">
                                Aceitar
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
