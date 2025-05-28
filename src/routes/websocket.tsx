import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";

import s from "../styles/websocket.module.scss";
import BidCard from "../components/BidCard";
import useSocketIo from "../hooks/useSocketIo";

export const Route = createFileRoute("/websocket")({
  component: WebSocketComponent,
});

function WebSocketComponent() {
  // const ws = useRef(new WebSocket("ws://localhost:8080"));
  const { socket } = useSocketIo("http://localhost:8080");
  const [data, setData] = useState();
  const [storedDatabase, setStoredDatabase] = useState([]);
  const [channelId, setChannelId] = useState();
  const [name, setName] = useState("");
  const [token, setToken] = useState(3);

  // const initWs = (n = 1) => {
  //   const ab = new AbortController();
  //   ws.current = new WebSocket("ws://localhost:8080");
  //   ws.current.addEventListener(
  //     "open",
  //     (event) => {
  //       // ws.current.send(JSON.stringify("test"));
  //     },
  //     { signal: ab.signal }
  //   );

  //   ws.current.addEventListener(
  //     "message",
  //     (event) => {
  //       const res = JSON.parse(event.data);
  //       console.log("event data", res);
  //       // if (res.type === "test") {
  //       //   setChannelId(res.data);
  //       // } else if (res.type === "stored") setStoredDatabase(res.data);
  //       if (res.type === "items_update") {
  //         setStoredDatabase(res.items);
  //       } else if (res.type === "item_update") {
  //         setStoredDatabase((prevState) =>
  //           prevState.map((item) => {
  //             if (item.id === res.item.id) {
  //               return res.item;
  //             } else {
  //               return {
  //                 ...item,
  //                 bidDuration: item.bidDuration - 1000,
  //               };
  //             }
  //           })
  //         );
  //       }

  //       // else setData(res.data);
  //     },
  //     { signal: ab.signal }
  //   );

  //   ws.current.addEventListener("error", (event) => {
  //     console.log("error", event);
  //   });

  //   ws.current.addEventListener("close", (event) => {
  //     console.log("close", event);
  //     ab.abort();
  //     console.log("n tried", n);
  //     if (n < 3) {
  //       setTimeout(() => {
  //         initWs(n + 1);
  //       }, n * 1000);
  //     } else {
  //       alert("websocket died");
  //     }
  //   });
  // };

  useEffect(() => {
    // initWs();
    reduceAllCountdown();
    window.addEventListener("offline", () => {
      alert("offline");
    });

    window.addEventListener("online", (event) => {
      console.log("online", event);
    });
  }, []);

  useEffect(() => {
    socket.on("connect", (socket) => {
      console.log("connect", socket);
    });

    socket.on("items_update", (socket) => {
      setStoredDatabase(socket.items);
    });

    socket.on("item_update", (socket) => {
      console.log("item update", socket);

      const currentDataStore = [...storedDatabase];
      const loc = currentDataStore.findIndex(
        (item) => item.id === socket.item.id
      );
      const dataStore = [
        ...currentDataStore.slice(0, loc),
        {
          ...socket.item,
        },
        ...currentDataStore.slice(loc + 1),
      ];
      setStoredDatabase(dataStore);
    });
  }, []);

  // useEffect(() => {
  //   if (storedDatabase.length > 0) {
  //     reduceAllCountdown();
  //   }
  // }, [storedDatabase]);

  const reduceAllCountdown = () => {
    setInterval(() => {
      setStoredDatabase((prevState) =>
        prevState.map((item) => {
          return {
            ...item,
            bidDuration: item.bidDuration - 1000,
          };
        })
      );
    }, 1000);
  };

  const sendData = (id) => {
    const currentDataStore = [...storedDatabase];
    const loc = currentDataStore.findIndex((item) => item.id === id);
    const dataStore = [
      ...currentDataStore.slice(0, loc),
      {
        ...currentDataStore[loc],
        content: {
          ...currentDataStore[loc].content,
          message: `from client ${name}`,
        },
      },
      ...currentDataStore.slice(loc + 1),
    ];
    setStoredDatabase(dataStore);
    setToken((prevState) => prevState - 1);
    // ws.current.send(
    //   JSON.stringify({
    //     isUpdated: true,
    //     id,
    //     message: name,
    //   })
    // );
  };

  const sendBidData = (id) => {
    const currentDataStore = [...storedDatabase];
    const loc = currentDataStore.findIndex((item) => item.id === id);
    const dataStore = [
      ...currentDataStore.slice(0, loc),
      {
        ...currentDataStore[loc],
        lastBidders: [
          ...currentDataStore[loc].lastBidders,
          {
            name,
          },
        ],
      },
      ...currentDataStore.slice(loc + 1),
    ];
    setToken((prevState) => prevState - 1);
    setStoredDatabase(dataStore);
    socket.emit("place_bid", {
      bidderName: name,
      itemId: id,
    });
    // ws.current.send(
    //   JSON.stringify({
    //     bidderName: name,
    //     itemId: id,
    //     type: "place_bid",
    //   })
    // );
  };
  // console.log("stored database", storedDatabase);
  return (
    <div>
      <p>websocket</p>
      <p>random: {data}</p>
      <p>Token: {token}</p>
      <div>
        <label>Name</label>
        <input
          className={s.input}
          onChange={(ev) => setName(ev.currentTarget.value)}
          value={name}
        ></input>
      </div>
      <div className={s.container}>
        {storedDatabase?.map((data) => (
          // <div
          //   className={s.item}
          //   key={data.id}
          //   onClick={() => sendData(data.id)}
          // >
          //   <p>{data.name}</p>
          //   <p>{data.content?.message}</p>
          // </div>
          <BidCard data={data} sendData={sendBidData} />
        ))}
      </div>
      {/* <p>Channel ID: {channelId}</p>
      <button onClick={sendData}>Send</button> */}
    </div>
  );
}

export default WebSocketComponent;
