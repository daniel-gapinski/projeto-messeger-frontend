import { io, Socket } from "socket.io-client";

interface AuthenticatedSocket extends Socket {
  auth: { token?: string };
}

let socket: AuthenticatedSocket | null = null;

export function connectSocket(token?: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token
      },
      autoConnect: true,
    }) as AuthenticatedSocket;

    socket.on("connect", () => {
      console.log("Socket conectado:", socket?.id);

      window.dispatchEvent(new Event("socketConnected"));
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket desconectado:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("Erro de conexão:", err.message);
    });

    socket.on("connected", (msg) => {
      console.log("Servidor:", msg.message);
    });

    socket.on("directMessage", (message) => {
      console.log("Nova mensagem recebida:", message);

      const event = new CustomEvent("newDirectMessage", {
        detail: message
      });
      window.dispatchEvent(event);
    });

    socket.on("messagesReadUpdate", (data) => {
      console.log("Mensagens marcadas como lidas:", data);

      const event = new CustomEvent("messagesReadUpdate", { detail: data });
      window.dispatchEvent(event);
    });

    socket.on("messageSent", (message) => {
      console.log("Mensagem enviada com sucesso:", message);
      const event = new CustomEvent("messageSent", {
        detail: message
      });

      window.dispatchEvent(event);
    });

    socket.on("error", (msg) => {
      console.error("Erro do servidor:", msg);
    });
  } else if (token && socket.auth.token !== token) {
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }
  }

  socket.on("friendRequestReceived", (data) => {
    console.log("Novo pedido de amizade recebido:", data);
    window.dispatchEvent(new CustomEvent("friendRequestReceived", { detail: data }));
  });

  socket.on("friendRequestSent", (data) => {
    console.log("Pedido de amizade enviado:", data);
    window.dispatchEvent(new CustomEvent("friendRequestSent", { detail: data }));
  });

  socket.on("friendRequestAccepted", (data) => {
    console.log("Pedido aceito:", data);
    window.dispatchEvent(new CustomEvent("friendRequestAccepted", { detail: data }));
  });

  socket.on("friendRequestRejected", (data) => {
    console.log("Pedido rejeitado:", data);
    window.dispatchEvent(new CustomEvent("friendRequestRejected", { detail: data }));
  });

  return socket;
}

export function sendDirectMessageSocket(data: { content: string; friendId: string }) {
  if (!socket || !socket.connected) {
    console.warn("Socket não está conectado!");
    return;
  }

  socket.emit("directMessage", data);
}

export function getSocket() {
  return socket;
}

export function emitMessagesRead(friendId: string) {
  const socket = getSocket();
  if (!socket || !socket.connected) {
    console.warn("Socket não conectado para marcar mensagens lidas!");
    return;
  }

  socket.emit("messagesRead", { friendId });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
