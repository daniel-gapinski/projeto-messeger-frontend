import { createContext, useState, useEffect, type ReactNode } from "react";
import { getSocket } from "../socket/Socket";
import { api } from "../services/apiClient";

interface ChatContextData {
    sendDirectMessage: (content: string, friendId: string) => void;
    getMessagesByFriend: (friendId: string) => MessageProps[];
    clearMessages: () => void;
    getFriendById: (friendId: string) => FriendProps | null;
    getMessages: (friendId: string) => Promise<void>;
    unreadMessages: (friendId: string) => Promise<UnreadMessagesResponse | null>;
}

interface ChatProviderProps {
    children: ReactNode;
}

interface FriendProps {
    id: string;
    username: string;
    email?: string;
}

export interface MessageProps {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    friendId: string;
    sender: {
        id: string;
        username: string;
    };
}

interface GetMessagesResponse {
    messages: MessageProps[];
    friend: FriendProps | null;
}

interface UnreadMessagesResponse {
    unreadCount: number;
}

export const ChatContext = createContext({} as ChatContextData);

export function ChatProvider({ children }: ChatProviderProps) {

    const [messagesByFriend, setMessagesByFriend] = useState<Record<string, MessageProps[]>>({});
    const [friendsInfo, setFriendsInfo] = useState<Record<string, FriendProps>>({});

    useEffect(() => {
        function setupListeners() {
            const socket = getSocket();
            if (!socket) {
                return;
            }

            const handleNewMessage = (message: MessageProps) => {
                if (!message.friendId) {
                    return;
                }

                setMessagesByFriend(prev => {
                    const existing = prev[message.friendId] || [];
                    const alreadyExists = existing.some(m => m.id === message.id);

                    if (alreadyExists) {
                        return prev;
                    }

                    return {
                        ...prev,
                        [message.friendId]: [...existing, message],
                    };
                });
            };

            const handleMessagesReadUpdate = (data: { friendId: string }) => {
                setMessagesByFriend(prev => {
                    const msgs = prev[data.friendId] || [];
                    const updated = msgs.map(m => ({ ...m, read: true }));
                    return { ...prev, [data.friendId]: updated };
                });
            };

            socket.on("directMessage", handleNewMessage);
            socket.on("messageSent", handleNewMessage);
            socket.on("messagesReadUpdate", handleMessagesReadUpdate);

            return () => {
                socket.off("directMessage", handleNewMessage);
                socket.off("messageSent", handleNewMessage);
                socket.off("messagesReadUpdate", handleMessagesReadUpdate);
            };
        }

        const cleanup = setupListeners();

        window.addEventListener("socketConnected", setupListeners);

        return () => {
            if (cleanup) {
                cleanup();
            }
            window.removeEventListener("socketConnected", setupListeners);
        };
    }, []);

    function sendDirectMessage(content: string, friendId: string) {
        if (!content.trim()) {
            return;
        }
        const socket = getSocket();
        if (!socket) {
            throw new Error("Socket não conectado");
        }

        socket.emit("directMessage", {
            content,
            friendId,
        });
    }

    function getMessagesByFriend(friendId: string) {
        return messagesByFriend[friendId] || [];
    }

    function clearMessages() {
        setMessagesByFriend({});
        setFriendsInfo({});
    }

    function getFriendById(friendId: string) {
        return friendsInfo[friendId] || null;
    }

    async function getMessages(friendId: string) {
        try {
            const response = await api.get<GetMessagesResponse>(`/direct/${friendId}`);
            const { messages, friend } = response.data;

            setMessagesByFriend(prev => ({
                ...prev,
                [friendId]: messages,
            }));
            if (friend) {
                setFriendsInfo(prev => ({
                    ...prev,
                    [friendId]: friend,
                }));
            }

        } catch (err) {
            console.error("Erro ao buscar mensagens!");
        }
    }

    async function unreadMessages(friendId: string): Promise<UnreadMessagesResponse | null> {
        if (!friendId) {
            return {
                unreadCount: 0
            };
        }
        try {
            const response = await api.get<UnreadMessagesResponse>(`/unreadMessages/${friendId}`);
            return response.data;
        } catch (err) {
            console.log("Erro ao buscar quantidade de msgs não lidas!");
            return { unreadCount: 0 };
        }
    }

    return (
        <ChatContext.Provider value={{
            sendDirectMessage,
            getMessagesByFriend,
            clearMessages,
            getMessages,
            getFriendById,
            unreadMessages,
        }}>
            {children}
        </ChatContext.Provider>
    );
}
