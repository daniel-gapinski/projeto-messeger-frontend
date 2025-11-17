import { useContext, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { Pencil, X } from "lucide-react";
import profile from "../assets/profile.png";
import { AuthContext } from "../contexts/AuthContext";

export default function ProfileModal() {
  const { closeModal } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [avatar, setAvatar] = useState(profile);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-md h-full bg-white flex flex-col animate-fadeIn rounded-2xl overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3 border-b border-dark-gray bg-white">
        <h2 className="text-xl font-semibold text-primary tracking-tight select-none">
          Perfil do usuário
        </h2>
        <button
          onClick={closeModal}
          className="p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <section className="px-5 py-5 flex flex-col gap-6 items-center">
        <div className="relative w-28 h-28 mb-4">
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-2 border-primary"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/80 bg-opacity-30 rounded-full opacity-0 hover:opacity-100 cursor-pointer transition">
            <Pencil className="text-white w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-10 rounded-xl bg-white-bg text-sm px-4 text-gray placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 rounded-xl bg-white-bg text-sm px-4 text-gray placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div className="flex justify-center gap-3 mt-4 w-full">
          <button
            onClick={closeModal}
            className="px-5 py-2 cursor-pointer rounded-2xl border border-gray-300 text-gray hover:bg-gray-100 transition"
          >
            Fechar
          </button>
          <button
            className="flex items-center cursor-pointer gap-2 px-5 py-2 rounded-2xl bg-primary text-white hover:bg-primary-hover transition"
          >
            <Pencil size={16} />
            <span>Atualizar</span>
          </button>
        </div>
      </section>
    </div>
  );
}
