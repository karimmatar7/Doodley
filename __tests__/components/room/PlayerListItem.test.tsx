import { render, screen } from "@testing-library/react";
import PlayerListItem from "@/components/room/PlayerListItem";

describe("PlayerListItem", () => {
  it("renders name, tag, and score", () => {
    render(<PlayerListItem displayName="Karim" discriminator="2134" score={40} />);
    expect(screen.getByText("Karim")).toBeInTheDocument();
    expect(screen.getByText("#2134")).toBeInTheDocument();
    expect(screen.getByText("40 pts")).toBeInTheDocument();
  });

  it("shows a host badge when isHost is true", () => {
    render(<PlayerListItem displayName="Karim" discriminator="2134" isHost />);
    expect(screen.getByText("Host")).toBeInTheDocument();
  });

  it("hides the host badge when isHost is false", () => {
    render(<PlayerListItem displayName="Karim" discriminator="2134" />);
    expect(screen.queryByText("Host")).not.toBeInTheDocument();
  });

    it("shows an Add button when onAdd is provided and addState is none", () => {
    render(<PlayerListItem displayName="Karim" discriminator="2134" onAdd={() => {}} addState="none" />);
    expect(screen.getByText("+ Add")).toBeInTheDocument();
  });

  it("shows Pending instead of the Add button", () => {
    render(<PlayerListItem displayName="Karim" discriminator="2134" onAdd={() => {}} addState="pending" />);
    expect(screen.queryByText("+ Add")).not.toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});