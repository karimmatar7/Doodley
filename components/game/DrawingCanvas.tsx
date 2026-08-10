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
  "#EC4899", // pink
];

const ERASER_COLOR = "#FFFFFF";

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
      size: selectedLineWidth,
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
      size: selectedLineWidth,
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
    <div className="w-full space-y-3">
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
                  ? "scale-110 border-white ring-2 ring-white/40"
                  : "border-white/20"
              }`}
              style={{ backgroundColor: item }}
            />
          ))}

          <button
            type="button"
            onClick={() => setIsEraser(true)}
            aria-label="Use eraser"
            aria-pressed={isEraser}
            className={`flex h-8 items-center gap-1 rounded-md border px-3 text-xs font-medium transition-colors ${
              isEraser
                ? "border-white bg-white text-slate-900"
                : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
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
            className="h-8 rounded-md border border-white/15 bg-slate-900 px-2 text-xs text-slate-200 outline-none"
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
        className={`block w-full rounded-lg border-2 border-brand-blue-dark bg-brand-white ${
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