import { render, screen, fireEvent } from "@testing-library/react";
import FriendListItem from "@/components/friends/FriendListItem";

describe("FriendListItem", () => {
  it("renders the friend's tag", () => {
    render(<FriendListItem displayName="Player" discriminator="0478" onMessage={() => {}} onUnfriend={() => {}} />);
    expect(screen.getByText("Player")).toBeInTheDocument();
  });

  it("calls onMessage when Message is clicked", () => {
    const onMessage = jest.fn();
    render(<FriendListItem displayName="Player" discriminator="0478" onMessage={onMessage} onUnfriend={() => {}} />);
    fireEvent.click(screen.getByText("Message"));
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it("calls onUnfriend when Unfriend is clicked", () => {
    const onUnfriend = jest.fn();
    render(<FriendListItem displayName="Player" discriminator="0478" onMessage={() => {}} onUnfriend={onUnfriend} />);
    fireEvent.click(screen.getByText("Unfriend"));
    expect(onUnfriend).toHaveBeenCalledTimes(1);
  });
});