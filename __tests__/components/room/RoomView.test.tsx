import { render, screen } from "@testing-library/react";
import RoomView from "@/components/room/RoomView";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/hooks/useProfile", () => ({
  useProfile: () => ({
    profile: { id: "host-1", display_name: "Karim", discriminator: "6806" },
    loading: false,
  }),
}));

jest.mock("@/lib/hooks/useRoom", () => ({
  useRoom: () => ({
    room: {
      id: "room-1",
      code: "AB3XZ",
      status: "lobby",
      host_id: "host-1",
      max_rounds: 3,
      current_round: 0,
      round_duration_seconds: 80,
    },
    loading: false,
    error: null,
  }),
}));

jest.mock("@/lib/hooks/useRoomPlayers", () => ({
  useRoomPlayers: () => ({
    players: [
      { id: "p1", profile_id: "host-1", score: 0, has_drawn: false, display_name: "Karim", discriminator: "6806" },
      { id: "p2", profile_id: "guest-1", score: 0, has_drawn: false, display_name: "Guest", discriminator: "1234" },
    ],
    loading: false,
  }),
}));

jest.mock("@/lib/hooks/useFriends", () => ({
  useFriends: () => ({
    friends: [],
    incoming: [],
    outgoing: [],
    sendRequest: jest.fn(),
    acceptRequest: jest.fn(),
    statusWith: () => "none",
  }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({ update: () => ({ eq: jest.fn() }) }),
  }),
}));

describe("RoomView", () => {
  it("shows the room code and player list", () => {
    render(<RoomView code="AB3XZ" />);
    expect(screen.getByText("AB3XZ")).toBeInTheDocument();
    expect(screen.getByText("Karim")).toBeInTheDocument();
    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  it("enables Start game for host with 2+ players", () => {
    render(<RoomView code="AB3XZ" />);
    expect(screen.getByText("Start game")).toBeInTheDocument();
  });
});