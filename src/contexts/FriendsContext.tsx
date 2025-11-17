import { createContext, useEffect, useState, type ReactNode, useCallback, useContext } from "react";
import { api } from "../services/apiClient";
import { AuthContext } from "./AuthContext";
import { getSocket } from "../socket/Socket";

interface FriendsContextData {
    getFriends: () => Promise<void>;
    friends: Friend[];
    addFriend: (email: string) => Promise<void>;
    pendingRequests: FriendRequest[];
    fetchPendingRequests: () => Promise<void>;
    pendingCount: number;
    acceptFriendRequest: (friendShipId: string) => Promise<void>;
    rejectFriendRequest: (friendShipId: string) => Promise<void>;
}

interface FriendsProviderProps {
    children: ReactNode;
}

export interface Friend {
    id: string;
    friendId: string;
    username: string;
    status: string;
}

export interface FriendRequest {
    id: string;
    requesterId: string;
    addresseeId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    requester?: {
        id: string;
        username: string;
        email: string;
    };
}


export const FriendsContext = createContext({} as FriendsContextData);

export function FriendsProvider({ children }: FriendsProviderProps) {
    const { isAuthenticated, user } = useContext(AuthContext);

    const [friends, setFriends] = useState<Friend[]>([]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [pendingCount, setPendingCount] = useState(0);

    const getFriends = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            return;
        }
        try {
            const response = await api.get("/friends");
            setFriends(response.data);
        } catch (err) {
            console.error("Erro ao buscar amigos!");
        }
    }, [isAuthenticated, user?.id]);

    const fetchPendingRequests = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            return;
        }

        try {
            const response = await api.get("/friend/pending");
            const data = response.data.pendingRequests || response.data;

            const formatted = Array.isArray(data) ? data : [];
            setPendingRequests(formatted);
            setPendingCount(response.data.count || formatted.length);

        } catch (err) {
            console.error("Erro ao buscar pedidos pendentes");
            setPendingRequests([]);
            setPendingCount(0);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        if (isAuthenticated) {
            getFriends();
            fetchPendingRequests();
        }
    }, [getFriends, isAuthenticated]);

    async function addFriend(email: string): Promise<void> {
        const socket = getSocket();

        if (!socket || !socket.connected) {
            return Promise.reject(new Error("Socket não conectado"));
        }

        return new Promise((resolve, reject) => {
            socket.emit(
                "sendFriendRequest",
                { addresseeEmail: email },
                (response: { success: boolean; message: string }) => {
                    if (!response) {
                        return reject(new Error("Resposta inválida do servidor"));
                    }

                    if (response.success) {
                        resolve();
                    } else {
                        reject(new Error(response.message || "Erro ao enviar pedido"));
                    }
                }
            );
        });
    }

    async function acceptFriendRequest(friendShipId: string) {
        const socket = getSocket();

        if (!socket || !socket.connected) {
            return;
        }

        setPendingRequests((prev) => prev.filter((p) => p.id !== friendShipId));
        setPendingCount((prev) => Math.max(prev - 1, 0));

        socket.emit("updateFriendRequest", { friendId: friendShipId, action: "accept" });

    }


    async function rejectFriendRequest(friendShipId: string) {
        try {
            await api.delete(`/friend/reject?friendshipId=${friendShipId}`);

            setPendingRequests((prev) => prev.filter(p => p.id !== friendShipId));
            setPendingCount((prev) => Math.max(prev - 1, 0));

        } catch (err) {
            console.error("Erro ao recusar amizade");
        }
    }

    useEffect(() => {
        const socket = getSocket();
        if (!socket) {
            return;
        }

        const handleRequestReceived = (request: FriendRequest) => {
            setPendingRequests((prev) => [...prev, request]);
            setPendingCount((prev) => prev + 1);
        };

        const handleRequestAccepted = async (friend: Friend) => {

            setFriends((prev) => {
                const alreadyExists = prev.some(f => f.id === friend.id || f.friendId === friend.friendId);
                if (alreadyExists) return prev;
                return [...prev, friend];
            });

            setPendingRequests((prev) => prev.filter(p => p.id !== friend.id));
            setPendingCount((prev) => Math.max(prev - 1, 0));

            await getFriends();
        };


        const handleRequestRejected = (friendshipId: string) => {
            setPendingRequests((prev) => prev.filter(p => p.id !== friendshipId));
            setPendingCount((prev) => Math.max(prev - 1, 0));
        };

        socket.on("friendRequestReceived", handleRequestReceived);
        socket.on("friendRequestAccepted", handleRequestAccepted);
        socket.on("friendRequestRejected", handleRequestRejected);

        return () => {
            socket.off("friendRequestReceived", handleRequestReceived);
            socket.off("friendRequestAccepted", handleRequestAccepted);
            socket.off("friendRequestRejected", handleRequestRejected);
        };
    }, [getFriends]);


    return (
        <FriendsContext.Provider
            value={{
                getFriends,
                addFriend,
                fetchPendingRequests,
                acceptFriendRequest,
                rejectFriendRequest,
                pendingRequests,
                friends,
                pendingCount,
            }}
        >
            {children}
        </FriendsContext.Provider>
    );
}
