import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

type TConfig = {
  autoInitialize?: boolean;
};
const useSocketIo = (url: string, config?: TConfig) => {
  const { autoInitialize  = true} = config || {};

  const [socketIo, setSocketIo] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(autoInitialize ? io(url) : null);

  const initSocket = () => {
    if(!autoInitialize) setSocketIo(io(url));
  };

  return {
    socket: socketIo,
    initSocket,
  };
};

export default useSocketIo;
