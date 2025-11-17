import { Send } from "lucide-react";
import ChatWindowPage from "../containers/ChatWindowPage";
import profile from "../assets/profile.png";
import { useLayoutEffect, useRef } from "react";

export default function ChatWindow() {
    return (
        <ChatWindowPage>
            {({ messages, friend, message, setMessage, handleSendMessage, user }) => {
                const messagesContainerRef = useRef<HTMLDivElement>(null);

                useLayoutEffect(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                    }
                }, [messages]);

                return (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 px-4 py-4.5 border-b border-dark-gray bg-white">
                            <div className="h-9 w-9">
                                <img
                                    src={profile}
                                    alt="profile"
                                    className="w-full h-full rounded-full"
                                />
                            </div>
                            <h2 className="text-lg font-semibold capitalize">
                                {friend?.username || "Carregando..."}
                            </h2>
                        </div>

                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 bg-white-bg space-y-2 scrollbar-thin"
                        >
                            {messages.length === 0 && (
                                <p className="text-gray-400 text-center mt-10">
                                    Nenhuma mensagem ainda.
                                </p>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg max-w-[65%] break-words overflow-hidden text-ellipsis ${msg.senderId === user?.id ? "bg-primary text-gray-200" : "bg-white"
                                            }`}
                                        style={{
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {msg.content}
                                    </div>

                                </div>
                            ))}
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="flex p-3 border-t border-dark-gray bg-white gap-2"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 bg-black-bg rounded-2xl text-gray px-4 py-2 outline-none"
                                placeholder="Digite uma mensagem..."
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-5 py-2 rounded-2xl hover:bg-primary-hover transition"
                            >
                                <Send />
                            </button>
                        </form>
                    </div>
                );
            }}
        </ChatWindowPage>
    );
}
