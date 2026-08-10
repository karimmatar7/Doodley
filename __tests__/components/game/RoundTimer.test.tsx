import { render, screen } from "@testing-library/react";
import RoundTimer from "@/components/game/RoundTimer";

describe("RoundTimer", () => {
  it("renders a formatted countdown", () => {
    const future = new Date(Date.now() + 65000).toISOString();
    render(<RoundTimer endsAt={future} />);
    expect(screen.getByText(/^\d:\d{2}$/)).toBeInTheDocument();
  });
});