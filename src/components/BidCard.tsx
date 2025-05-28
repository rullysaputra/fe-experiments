import React from "react";
import s from "./BidCard.module.scss";

type Props = {
  data: any;
  sendData: (id: string) => void;
};

function msToTimeFormatCompact(milliseconds) {
  const ms = Number(milliseconds);

  if (isNaN(ms)) {
    return "Invalid input";
  }

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

const BidCard = ({ data, sendData }: Props) => {
  const endTime = new Date(data.currentBidEndTime);

  const datePart = endTime
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .split("/")
    .join(" ");

  const timePart = endTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className={s.item} key={data.id} onClick={() => sendData(data.id)}>
      <p>{data.name}</p>
      <p style={{ fontSize: "20px" }}>
        Last bidders: {data.lastBidders[0]?.name}
      </p>
      <p>Current Price: {data.currentPrice}</p>
      <p>
        End: {datePart} - {timePart}
      </p>
      <p>Countdown: {msToTimeFormatCompact(data.bidDuration)}</p>
    </div>
  );
};

export default BidCard;
