import { Outlet } from "react-router-dom";
import ChatList from "./ChatList";
import { Bell, ChevronDown } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { AddFriendsModal } from "../components/AddFriendsModal";
import AcceptFriendModal from "../components/AcceptFriendModal";
import Loggout from "../components/Loggout";
import { FriendsContext } from "../contexts/FriendsContext";
import { PageTitle } from "../components/PageTitle";

export default function ChatLayout() {

    const { openModal } = useContext(ModalContext);
    const { fetchPendingRequests, pendingCount } = useContext(FriendsContext);
    const [showLogout, setShowLogout] = useState(false);
    const logoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
                setShowLogout(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchPendingRequests();

    }, []);

    return (
        <>
        <PageTitle title="Página Inicial" />
            <div className="flex h-screen bg-white">
                <div className="w-102 h-full border-r border-dark-gray overflow-y-auto">
                    <ChatList />
                </div>

                <div className="flex-1 flex flex-col h-full">
                    <div className="flex items-center justify-between px-5 py-4.5 border-b border-dark-gray bg-white">
                        <div>
                            <button
                                className="cursor-pointer px-3 text-sm py-2.5 bg-primary text-white rounded-md hover:bg-primary-hover transition"
                                onClick={() => openModal(<AddFriendsModal />)}
                            >
                                Adicionar amigo
                            </button>
                        </div>

                        <div className="flex gap-2 items-center relative">
                            {pendingCount > 0 && (
                                <div className="absolute bottom-3 left-2 bg-warning h-4 w-4 flex justify-center items-center rounded-full">
                                    <span className="text-white text-[11px]">{pendingCount}</span>
                                </div>
                            )}
                            <button
                                onClick={() => openModal(<AcceptFriendModal />)}
                                className="bell-hover cursor-pointer">
                                <Bell size={18} />
                            </button>
                            <button
                                onClick={() => setShowLogout(prev => !prev)}
                                className="cursor-pointer hover:scale-110">
                                <ChevronDown size={18} />
                            </button>
                            {showLogout && (
                                <div ref={logoutRef} className="absolute right-0 mt-2">
                                    <Loggout />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
