import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import s from "../styles/about.module.scss";
export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

const data = Array.from({ length: 10000 }, (_, i) => i + 1);

function AboutComponent() {
  return (
    <div className="p-2 relative">
      <h3>About</h3>
      <div className={s.card}>
        <div className={s.number}>1</div>
      </div>
      {data.map((i) => (
        <p>{i}</p>
      ))}
      <div className={s.sticky_footer_button}>
        <button>click</button>
      </div>
    </div>
  );
}
