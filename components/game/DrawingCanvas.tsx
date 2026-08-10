"use client";

import { useEffect, useRef } from "react";
import { useDrawChannel, StrokePoint } from "@/lib/hooks/useDrawChannel";

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

  function drawPoint(ctx: CanvasRenderingContext2D, point: StrokePoint) {
    if (point.type === "start") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.size;
    } else if (point.type === "move") {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }

  const { sendPoint, loadExistingStrokes } = useDrawChannel(roundId, (point) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawPoint(ctx, point);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadExistingStrokes().then((strokes) => strokes.forEach((p) => drawPoint(ctx, p)));
  }, [roundId, loadExistingStrokes]);

  function getRelativePoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;
    isDrawingRef.current = true;
    const { x, y } = getRelativePoint(e);
    const point: StrokePoint = { x, y, color, size: lineWidth, type: "start" };
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawPoint(ctx, point);
    sendPoint(point);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer || !isDrawingRef.current) return;
    const { x, y } = getRelativePoint(e);
    const point: StrokePoint = { x, y, color, size: lineWidth, type: "move" };
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawPoint(ctx, point);
    sendPoint(point);
  }

  function handlePointerUp() {
    isDrawingRef.current = false;
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`w-full bg-brand-white rounded-lg border-2 border-brand-blue-dark ${isDrawer ? "cursor-crosshair" : "cursor-default"}`}
    />
  );
}