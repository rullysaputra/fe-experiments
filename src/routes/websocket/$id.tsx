import { createFileRoute } from "@tanstack/react-router";
import useSocketIo from "../../hooks/useSocketIo";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/websocket/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [data, setData] = useState({});
  const { socket, initSocket } = useSocketIo("http://localhost:8080", {
    autoInitialize: true,
  });

  useEffect(() => {
    socket?.on("connect", () => {
      socket.emit("initial_inventory_detail", {
        itemId: id,
      });
    });

    socket?.on("get_inventory_detail", (data) => {
      console.log("data", data);
      setData(data);
    });
  }, [socket]);

  return (
    <div>
      <button onClick={initSocket}>init</button>
      {JSON.stringify(data)}
    </div>
  );
}
