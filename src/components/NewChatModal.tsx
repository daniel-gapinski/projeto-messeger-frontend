import { useContext, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { X } from "lucide-react";
import profile from "../assets/profile.png";
import { FriendsContext } from "../contexts/FriendsContext";

interface NewChatModalProps {
  onSelectFriend: (friendId: string) => void;
}

export default function NewChatModal({ onSelectFriend }: NewChatModalProps) {
  const { closeModal } = useContext(ModalContext);
  const { friends } = useContext(FriendsContext);
  const [search, setSearch] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white flex flex-col animate-fadeIn rounded-2xl overflow-hidden">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-dark-gray bg-white">
        <h2 className="text-xl font-semibold text-primary tracking-tight select-none">
          Nova conversa
        </h2>
        <button
          onClick={closeModal}
          className="p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <section className="px-5 py-3">
        <input
          type="text"
          placeholder="Procure um contato..."
          className="w-full h-10 rounded-xl bg-white-bg text-sm px-4 text-gray placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      <ul className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {filteredFriends.map(friend => (
          <li
            key={friend.id}
            onClick={() => {
              onSelectFriend(friend.id);
              closeModal();
            }}
            className="group cursor-pointer flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-primary-chat transition-all duration-200"
          >
            <img
              src={profile}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-[16px] font-medium capitalize">{friend.username}</p>
              <small className="text-sm text-gray group-hover:text-primary">
                Clique para iniciar uma conversa
              </small>
            </div>
          </li>
        ))}
        {filteredFriends.length === 0 && (
          <li className="text-gray-400 text-center py-5">
            Nenhum contato encontrado.
          </li>
        )}
      </ul>
    </div>
  );
}
