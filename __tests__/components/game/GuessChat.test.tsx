import { render, screen, fireEvent } from "@testing-library/react";
import GuessChat from "@/components/game/GuessChat";

const rpcMock = jest.fn();

jest.mock("@/lib/supabase/client", () => ({ createClient: () => ({ rpc: rpcMock }) }));
jest.mock("@/lib/hooks/useGuesses", () => ({
  useGuesses: () => ({
    guesses: [
      {
        id: 1,
        player_id: "p2",
        text: "cat",
        is_correct: false,
        points_awarded: 0,
        guessed_at: "2026-08-11T20:00:00Z",
      },
    ],
  }),
}));
jest.mock("@/lib/hooks/useRoomEvents", () => ({
  useRoomEvents: () => ({ events: [] }),
}));

const players = [
  { profile_id: "p1", display_name: "Karim", discriminator: "6806" },
  { profile_id: "p2", display_name: "Guest", discriminator: "1234" },
];

describe("GuessChat", () => {
  it("shows existing guesses", () => {
    render(
      <GuessChat
        roomId="room-1"
        roundId="r1"
        playerId="p1"
        isDrawer={false}
        players={players}
      />
    );
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("hides the input for the drawer", () => {
    render(
      <GuessChat
        roomId="room-1"
        roundId="r1"
        playerId="p1"
        isDrawer
        players={players}
      />
    );
    expect(screen.queryByLabelText("Guess")).not.toBeInTheDocument();
  });

  it("submits a guess via RPC for non-drawers", () => {
    render(
      <GuessChat
        roomId="room-1"
        roundId="r1"
        playerId="p1"
        isDrawer={false}
        players={players}
      />
    );
    fireEvent.change(screen.getByLabelText("Guess"), { target: { value: "dog" } });
    fireEvent.click(screen.getByText("Send"));
    expect(rpcMock).toHaveBeenCalledWith("submit_guess", { p_round_id: "r1", p_player_id: "p1", p_text: "dog" });
  });
});