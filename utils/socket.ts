// socket.ts
import { User } from "@/app/(tabs)/context/authContext";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (user: User) => {
  if (!user) return null;

  socket = io("http://83.166.244.36:3000", {
    query: { userId: user.id, username: user.login },
  });

  return socket;
};

export const getSocket = () => socket;
