"use client";

import { useParams } from "next/navigation";
import RoomView from "@/components/room/RoomView";

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  return <RoomView code={code} />;
}