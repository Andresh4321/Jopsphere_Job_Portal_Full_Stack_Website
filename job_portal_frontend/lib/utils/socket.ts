import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const TOKEN_KEY = 'kaam_token'; // must match the key used in lib/api/axiosClient.ts

let socket: Socket | null = null;

// Lazily creates (or reuses) a single authenticated socket connection.
// Call this only on the client, inside useEffect.
export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};