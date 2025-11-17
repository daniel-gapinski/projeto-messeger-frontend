import ChatListPage from "../containers/ChatListPage";
import { Plus } from "lucide-react";
import profile from "../assets/profile.png";
import { type Friend } from "../contexts/FriendsContext";
import { useContext, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import ProfileModal from "../components/ProfileModal";
import NewChatModal from "../components/NewChatModal";

export default function ChatList() {

  const { openModal } = useContext(ModalContext);
  const [search, setSearch] = useState("");

  return (
    <ChatListPage>
      {({
        friends,
        unreadCounts,
        handleOpenChat,
        getMessagesByFriend,
        locationPathname,
        selectedIndex,
      }) => (
        <div className="py-4">
          <header className="w-full flex justify-between items-center py-3 px-4 mb-4 border-b border-dark-gray">
            <h2 className="text-2xl font-semibold text-primary tracking-tight select-none">
              ChatDesk
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                className="h-9 w-9 cursor-pointer bg-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-transform hover:scale-105 active:scale-95"
                title="Novo chat"
                onClick={() => { openModal(<NewChatModal onSelectFriend={handleOpenChat} />) }}
              >
                <span className="text-white font-semibold leading-none"><Plus size={16} /></span>
              </button>

              <button
                disabled
                type="button"
                className="h-9 w-9 cursor-not-allowed bg-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-transform hover:scale-105 active:scale-95"
                title="Usuário"
                onClick={() => { openModal(<ProfileModal />) }}
              >
                <img src={profile} alt="profile" className="w-full h-full" />
              </button>
            </div>
          </header>

          {/* Search */}
          <section className="pb-4 border-b border-dark-gray px-4">
            <input
              type="text"
              onChange={(e) => {setSearch(e.target.value)}}
              value={search}
              placeholder="Procure uma conversa..."
              className="w-full h-10 rounded-xl text-sm px-4 bg-white-bg text-gray placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition"
            />
          </section>

          <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {friends
              .filter((friend: Friend) =>
                friend.username.toLowerCase().includes(search.toLowerCase())
              )
              .filter((friend: Friend) => getMessagesByFriend(friend.id)?.length > 0)
              .sort((a: Friend, b: Friend) => {
                const lastA = getMessagesByFriend(a.id).slice(-1)[0];
                const lastB = getMessagesByFriend(b.id).slice(-1)[0];
                const timeA = lastA ? new Date(lastA.createdAt).getTime() : 0;
                const timeB = lastB ? new Date(lastB.createdAt).getTime() : 0;
                return timeB - timeA;
              })
              .map((friend: Friend) => {
                const messages = getMessagesByFriend(friend.id);
                const lastMessage = messages[messages.length - 1];
                const showUnread = unreadCounts[friend.id] > 0 && locationPathname !== `/${friend.id}`;

                return (
                  <li
                    key={friend.id}
                    onClick={() => {
                      handleOpenChat(friend.id)
                    }}
                    className={`${selectedIndex === friend.id ? "bg-primary-chat" : "bg-white"} group cursor-pointer flex items-center justify-between py-4 px-4 hover:bg-primary-chat hover:text-primary transition-all duration-200 rounded-xl`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col">
                        <p className="text-[16px] font-medium truncate capitalize">{friend.username}</p>
                        <small className="text-sm text-gray group-hover:text-primary truncate overflow-hidden whitespace-nowrap max-w-[200px]">
                          {lastMessage ? lastMessage.content : ""}
                        </small>
                      </div>

                      <div className="flex flex-col items-end justify-center text-white gap-2 min-w-[60px]">
                        <small className="text-gray text-xs opacity-70 whitespace-nowrap">
                          {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </small>
                        {showUnread && (
                          <div className="w-5 h-5 bg-warning rounded-full flex items-center justify-center shadow-sm">
                            <p className="text-[12px] font-semibold leading-none">{unreadCounts[friend.id]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </ChatListPage>
  );
}
