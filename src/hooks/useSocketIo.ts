import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

const useSocketIo = (url: string) => {
  const socketIo = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    io(url)
  );
  
  return {
    socket: socketIo.current,
  };
};

export default useSocketIo;
