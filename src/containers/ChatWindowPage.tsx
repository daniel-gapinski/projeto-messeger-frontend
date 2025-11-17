import { useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";
import { AuthContext } from "../contexts/AuthContext";
import type { MessageProps } from "../contexts/ChatContext";
import { FriendsContext } from "../contexts/FriendsContext";
import { emitMessagesRead } from "../socket/Socket";

interface FriendProps {
    id: string;
    username: string;
    email?: string;
}

interface UserProps {
    id: string;
    username: string;
    email: string;
}

interface ChatWindowPageProps {
    children:
    (props: {
        messages: MessageProps[];
        friend: FriendProps | null;
        message: string;
        setMessage: (message: string) => void;
        handleSendMessage: (e: React.FormEvent) => void;
        user: UserProps | null;
    }) => ReactNode;
}

export default function ChatWindowPage({ children }: ChatWindowPageProps) {
    const { conversationId } = useParams<{ conversationId: string }>();

    const { getMessagesByFriend, sendDirectMessage, getMessages, getFriendById } = useContext(ChatContext);

    const { user } = useContext(AuthContext);
    const { friends } = useContext(FriendsContext);

    const [message, setMessage] = useState<string>("");

    const messages = getMessagesByFriend(conversationId!);
    const friendFromList = friends.find(f => f.id === conversationId);
    const friend = getFriendById(conversationId!) || friendFromList || null;

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                navigate("/");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [navigate]);

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) {
            return;
        }

        await sendDirectMessage(message, conversationId!);
        setMessage("");
    }

    useEffect(() => {
        if (conversationId) {
            getMessages(conversationId);
            emitMessagesRead(conversationId);
        }
    }, [conversationId]);

    return children({
        messages,
        friend,
        message,
        setMessage,
        handleSendMessage,
        user: user ?? null,
    });
}
