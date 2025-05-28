import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import s from "../styles/home.module.scss";
import { CSSPropertiesWithVars } from "../types";
import { add } from "../../assembly";
import Lottie from "react-lottie";
import Loading from "../assets/animation.json";
import Second from "../assets/second.json";
import Egg from "../assets/egg.png";
import CrackedEgg from "../assets/cracked-egg.png";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [isCompShow, setIsCompShow] = React.useState(false);
  const [val, setVal] = React.useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = React.useState(0);
  const [isClicked, setIsClicked] = React.useState(false);
  const lottieRef = React.useRef(null);
  const [isEggClicked, setIsEggClicked] = React.useState(false);
  const [isEggCracked, setIsEggCracked] = React.useState(false);
  const [isShowFooter, setIsShowFooter] = React.useState(false);

  const handleAddVal = () => setVal(add(2, 3));
  const loadShader = (gl: WebGLRenderingContext, type: any, source: any) => {
    const shader: WebGLShader = gl.createShader(type)!;
    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const getContext = () => {
    const gl = canvasRef.current?.getContext("webgl");
    if (gl) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main(){
          gl_position = uProjectionMatrix * uModelViewMatrix * aVertexPosition
        }
      `;

      const fsSource = `
        void main(){
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `;

      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader ?? {});
      gl.attachShader(shaderProgram, fragmentShader ?? {});
      gl.linkProgram(shaderProgram);

      if (!gl.getShaderParameter(shaderProgram, gl.LINK_STATUS))
        [console.error(gl.getProgramInfoLog(shaderProgram))];
    }
  };

  // Sample data with weights and colors
  const items = [
    { name: "Grand Prize", weight: 5, color: "#FF6B6B" },
    { name: "50% Off", weight: 15, color: "#4ECDC4" },
    { name: "Free Shipping", weight: 25, color: "#45B7D1" },
    { name: "10% Off", weight: 30, color: "#96CEB4" },
    { name: "Try Again", weight: 25, color: "#FFEEAD" },
  ];

  React.useEffect(() => {
    drawCanvas();
  }, []);

  React.useEffect(() => {
    console.log(lottieRef.current);
  }, [lottieRef.current]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);
    const height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);
    console.log(width, height, window.innerWidth);
    canvas.setAttribute(
      "width",
      `${window.innerHeight * window.devicePixelRatio}px`
    );
    canvas.setAttribute(
      "height",
      `${window.innerHeight * window.devicePixelRatio}px`
    );
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas?.width / 2;
    const centerY = canvas?.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // clear canvas
    ctx.clearRect(0, 0, canvas?.width, canvas?.height);

    ctx.save();

    // Move to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    // calculate angle for equal segments
    const segmentAngle = (2 * Math.PI) / items.length;

    items.forEach((item, index) => {
      const startAngle = -Math.PI / 2 + segmentAngle * index;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();

      // Add Text
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.font = "bold 0.8rem sans-serif";
      ctx.fillText(item.name, radius - 15, 3);
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawArrow(ctx, centerX, 20);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    y: number
  ) => {
    const arrowSize = 30;
    ctx.beginPath();
    ctx.moveTo(centerX - arrowSize / 2, y);
    ctx.lineTo(centerX + arrowSize / 2, y);
    ctx.lineTo(centerX, y + arrowSize);

    ctx.closePath();

    ctx.shadowColor = "rgba(0, 0,0,0.2)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "#FF4444";
    ctx.fill();
    ctx.strokeStyle = "#CC0000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowColor = "transparent";
  };

  return (
    <div className="p-2 relative">
      <h3>Welcome Home!</h3>
      <div className="flex gap-5">
        <button onClick={() => setIsCompShow(!isCompShow)}>
          manage header
        </button>
        <button onClick={() => handleAddVal()}>Add</button>
        <button onClick={() => getContext()}>Get Context</button>
        <button onClick={() => setIsShowFooter((prevState) => !prevState)}>
          Show footer
        </button>
        <button
          onClick={() => {
            window.location.assign("https://tiket.com");
            window.history.back();
          }}
        >
          Go to tiket
        </button>
      </div>
      {val && <div>{val}</div>}
      <div className={s.home_container}>
        <div className={isCompShow ? s.header_item : s.header_item_hide}>
          test
        </div>
        <div className={s.action_item}>action item</div>
      </div>
      <div
        className={s.grid_container}
        // style={{ ["--item-length" as string]: 4 }}
        style={{ "--item-length": 4 } as CSSPropertiesWithVars}
      >
        <div>terst</div>
        <div>test</div>
        <div>test3</div>
        <div>test4</div>
        {/* <div>test4</div>
        <div>test5</div>
        <div>test6</div> */}
      </div>
      <div style={{ width: 300, height: 300 }}>
        {isEggCracked ? (
          <img
            src={CrackedEgg}
            // className={s.cracked_egg}
            onClick={() => {
              setIsEggCracked(false);
              setIsEggClicked(false);
            }}
          />
        ) : (
          <img
            src={Egg}
            onClick={() => setIsEggClicked(true)}
            className={`${isEggClicked ? s.egg_bounce : ""}`}
            onAnimationEnd={(ev) => {
              console.log(ev);
              setIsEggCracked(true);
            }}
          />
        )}
      </div>
      {isClicked ? (
        <Lottie
          options={{
            loop: false,
            animationData: Second,
          }}
          eventListeners={[
            {
              eventName: "complete",
              callback: () => console.log("completed"),
            },
          ]}
        />
      ) : (
        <div onClick={() => setIsClicked(true)}>
          <Lottie
            options={{
              animationData: Loading,
            }}
          />
        </div>
      )}

      {/* <canvas
        ref={canvasRef}
        // style={{ width: "100%", height: "100%" }}
      ></canvas> */}
      <div className={s.show_types}>Show types</div>
      {isShowFooter && <div className={s.show_footer}>Footer</div>}
    </div>
  );
}
