"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { useDrawChannel, StrokePoint } from "@/lib/hooks/useDrawChannel";

const COLORS = [
  "#111827", // black
  "#8E0A1E", // maroon
  "#2563EB", // blue
  "#16A34A", // green
  "#EAB308", // yellow
  "#EA580C", // orange
  "#9333EA", // purple
];

const ERASER_COLOR = "#FFFFFF";
const ERASER_WIDTH = 24;

export default function DrawingCanvas({
  roundId,
  isDrawer,
  color = "#8E0A1E",
  lineWidth = 4,
}: {
  roundId: string;
  isDrawer: boolean;
  color?: string;
  lineWidth?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);

  const [selectedColor, setSelectedColor] = useState(color);
  const [selectedLineWidth, setSelectedLineWidth] = useState(lineWidth);
  const [isEraser, setIsEraser] = useState(false);
  const [customColor, setCustomColor] = useState("#64748B");

  const supabaseColor = isEraser ? ERASER_COLOR : selectedColor;

  function drawPoint(
    ctx: CanvasRenderingContext2D,
    point: StrokePoint
  ) {
    if (point.type === "start") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    if (point.type === "move") {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }

  const { sendPoint, loadExistingStrokes } = useDrawChannel(
    roundId,
    (point) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) drawPoint(ctx, point);
    }
  );

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  useEffect(() => {
    setSelectedLineWidth(lineWidth);
  }, [lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    loadExistingStrokes().then((strokes) => {
      strokes.forEach((point) => drawPoint(ctx, point));
    });
  }, [roundId, loadExistingStrokes]);

  function getRelativePoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;

    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(
    event: PointerEvent<HTMLCanvasElement>
  ) {
    if (!isDrawer) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    canvas.setPointerCapture(event.pointerId);
    activePointerIdRef.current = event.pointerId;
    isDrawingRef.current = true;

    const { x, y } = getRelativePoint(event);

    const point: StrokePoint = {
      x,
      y,
      color: supabaseColor,
      size: isEraser ? ERASER_WIDTH : selectedLineWidth,
      type: "start",
    };

    drawPoint(ctx, point);
    sendPoint(point);
  }

  function handlePointerMove(
    event: PointerEvent<HTMLCanvasElement>
  ) {
    if (
      !isDrawer ||
      !isDrawingRef.current ||
      activePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    const { x, y } = getRelativePoint(event);

    const point: StrokePoint = {
      x,
      y,
      color: supabaseColor,
      size: isEraser ? ERASER_WIDTH : selectedLineWidth,
      type: "move",
    };

    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) drawPoint(ctx, point);
    sendPoint(point);
  }

  function stopDrawing(
    event?: PointerEvent<HTMLCanvasElement>
  ) {
    isDrawingRef.current = false;
    activePointerIdRef.current = null;

    const canvas = canvasRef.current;

    if (
      canvas &&
      event &&
      canvas.hasPointerCapture(event.pointerId)
    ) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  function selectColor(nextColor: string) {
    setSelectedColor(nextColor);
    setIsEraser(false);
  }

  return (
    <div className="sketch-card w-full space-y-3 p-3">
      {isDrawer && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {COLORS.map((item) => (
            <button
              key={item}
              type="button"
              aria-label={`Use ${item}`}
              aria-pressed={!isEraser && selectedColor === item}
              onClick={() => selectColor(item)}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                !isEraser && selectedColor === item
                  ? "scale-110 border-ink ring-2 ring-brand-maroon"
                  : "border-ink/30"
              }`}
              style={{ backgroundColor: item }}
            />
          ))}

          <label
            title="Pick a custom color"
            className={`relative h-8 w-8 cursor-pointer border-2 border-ink/30 transition-transform ${
              !isEraser && selectedColor === customColor ? "scale-110" : ""
            }`}
            style={{
              background:
                "conic-gradient(#f43f5e, #f59e0b, #facc15, #22c55e, #06b6d4, #6366f1, #a855f7, #f43f5e)",
              borderRadius: "9999px",
            }}
          >
            <input
              type="color"
              value={customColor}
              onChange={(event) => {
                setCustomColor(event.target.value);
                selectColor(event.target.value);
              }}
              aria-label="Pick a custom color"
              className="absolute inset-0 h-full w-full cursor-pointer touch-manipulation rounded-full opacity-0"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsEraser(true)}
            aria-label="Use eraser"
            aria-pressed={isEraser}
            className={`chip-btn flex h-8 items-center gap-1 px-3 text-xs font-bold ${
              isEraser
                ? "bg-paper-dark text-ink"
                : "bg-paper-light text-ink-soft hover:bg-paper-dark"
            }`}
          >
            <span aria-hidden="true">⌫</span>
            Eraser
          </button>

          <select
            value={selectedLineWidth}
            onChange={(event) =>
              setSelectedLineWidth(Number(event.target.value))
            }
            aria-label="Brush size"
            className="h-8 cursor-pointer border-2 border-ink bg-paper-light px-3 text-xs font-bold text-ink outline-none transition-colors hover:bg-paper-dark focus:border-brand-maroon"
          >
            <option value={2}>Thin</option>
            <option value={4}>Medium</option>
            <option value={8}>Thick</option>
            <option value={14}>Large</option>
          </select>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            stopDrawing(event);
          }
        }}
        className={`block w-full border-2 border-ink/60 bg-white ${
          isDrawer
            ? "cursor-crosshair touch-none select-none"
            : "cursor-default"
        }`}
        style={{
          touchAction: isDrawer ? "none" : "auto",
        }}
      />
    </div>
  );
}