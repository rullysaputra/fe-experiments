import { useEffect, useRef, useState } from "react";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

const useSocketIo = (
  url: string,
  opts?: Partial<ManagerOptions & SocketOptions>
) => {
  const socketIo = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(
    io(url, opts)
  );

  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);

  useEffect(() => {
    socketIo?.current.on("connect", () => {
      setIsConnectionEstablished(true);
    });
  }, [socketIo]);

  const initSocket = () => {
    socketIo?.current.connect();
  };

  return {
    socket: socketIo.current,
    isConnectionEstablished,
    initSocket,
  };
};

export default useSocketIo;
