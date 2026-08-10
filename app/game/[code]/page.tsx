"use client";

import { useParams } from "next/navigation";
import GameView from "@/components/game/GameView";

export default function GamePage() {
  const { code } = useParams<{ code: string }>();
  return <GameView code={code} />;
}