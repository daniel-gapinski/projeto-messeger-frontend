import { useContext, useEffect, useState, type ReactNode } from "react";
import { FriendsContext } from "../contexts/FriendsContext";
import { ChatContext, type MessageProps } from "../contexts/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";
import { emitMessagesRead } from "../socket/Socket";

interface ChatListPageProps {
  children: (props: {
    friends: typeof FriendsContext extends { friends: infer F } ? F : any;
    unreadCounts: Record<string, number>;
    handleOpenChat: (friendId: string) => void;
    getMessagesByFriend: (friendId: string) => MessageProps[];
    locationPathname: string;
    selectedIndex: string | null;
    setSelectedIndex: (index: string | null) => void;
  }) => ReactNode;
}

export default function ChatListPage({ children }: ChatListPageProps) {
  const { friends } = useContext(FriendsContext);
  const { getMessagesByFriend, unreadMessages, getMessages } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [selectedIndex, setSelectedIndex] = useState<null | string>(null);

  function handleOpenChat(friendId: string, index?: string) {
    setUnreadCounts(prev => ({ ...prev, [friendId]: 0 }));
    emitMessagesRead(friendId);
    navigate(`/${friendId}`);
    if (typeof index === "string") {
      setSelectedIndex(index);
    }
  }

  async function fetchUnreadCounts() {
    const counts: Record<string, number> = {};

    for (let friend of friends) {
      if (!friend?.id) {
        continue;
      }

      try {
        const data = await unreadMessages(friend.id);
        counts[friend.id] = data?.unreadCount ?? 0;
      } catch {
        counts[friend.id] = 0;
      }
    }

    setUnreadCounts(counts);
  }

  useEffect(() => {
    async function fetchInitialMessages() {
      for (let friend of friends) {
        if (!friend?.id) {
          continue;
        }
        await getMessages(friend.id);
      }
    }

    if (friends.length > 0) {
      fetchUnreadCounts();
      fetchInitialMessages();
    }
  }, [friends]);

  useEffect(() => {
    function handleNewMessage(event: CustomEvent<MessageProps>) {
      const msg = event.detail;
      if (!msg.friendId) {
        return;
      }
      if (location.pathname === `/${msg.friendId}`) {
        return;
      }

      setUnreadCounts(prev => ({
        ...prev,
        [msg.friendId]: (prev[msg.friendId] || 0) + 1
      }));
    }

    function handleMessagesReadUpdate(event: CustomEvent<{ friendId: string }>) {
      const data = event.detail;
      setUnreadCounts(prev => ({
        ...prev,
        [data.friendId]: 0
      }));
    }

    window.addEventListener("newDirectMessage", handleNewMessage as any);
    window.addEventListener("messagesReadUpdate", handleMessagesReadUpdate as any);

    return () => {
      window.removeEventListener("newDirectMessage", handleNewMessage as any);
      window.removeEventListener("messagesReadUpdate", handleMessagesReadUpdate as any);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedIndex(null);
      return;
    }

    const friendId = location.pathname.slice(1);
    const exists = friends.some(friend => friend.id === friendId);
    if (exists) {
      setSelectedIndex(friendId);
    }
  }, [location.pathname, friends]);

  return children({
    friends,
    unreadCounts,
    handleOpenChat,
    getMessagesByFriend,
    locationPathname: location.pathname,
    selectedIndex,
    setSelectedIndex,
  });
}
