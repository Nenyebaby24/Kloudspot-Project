import { io } from "socket.io-client";

let socket = null;

export function connectSocket() {
  const url = import.meta.env.VITE_SOCKET_URL || "";
  if (!socket) {
    socket = io(url, { autoConnect: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    
    socket = null;
  }
}
