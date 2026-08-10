import { render, screen, fireEvent } from "@testing-library/react";
import FriendRequestItem from "@/components/friends/FriendRequestItem";

describe("FriendRequestItem", () => {
  it("renders the requester's tag", () => {
    render(<FriendRequestItem displayName="Player" discriminator="0478" onAccept={() => {}} onDecline={() => {}} />);
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("#0478")).toBeInTheDocument();
  });

  it("calls onAccept when Accept is clicked", () => {
    const onAccept = jest.fn();
    render(<FriendRequestItem displayName="Player" discriminator="0478" onAccept={onAccept} onDecline={() => {}} />);
    fireEvent.click(screen.getByText("Accept"));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onDecline when Decline is clicked", () => {
    const onDecline = jest.fn();
    render(<FriendRequestItem displayName="Player" discriminator="0478" onAccept={() => {}} onDecline={onDecline} />);
    fireEvent.click(screen.getByText("Decline"));
    expect(onDecline).toHaveBeenCalledTimes(1);
  });
});