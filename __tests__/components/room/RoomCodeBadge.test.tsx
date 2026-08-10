import { render, screen, fireEvent } from "@testing-library/react";
import RoomCodeBadge from "@/components/room/RoomCodeBadge";

Object.assign(navigator, { clipboard: { writeText: jest.fn() } });

describe("RoomCodeBadge", () => {
  it("displays the room code", () => {
    render(<RoomCodeBadge code="AB3XZ" />);
    expect(screen.getByText("AB3XZ")).toBeInTheDocument();
  });

  it("copies the code and shows confirmation", async () => {
    render(<RoomCodeBadge code="AB3XZ" />);
    fireEvent.click(screen.getByText("AB3XZ"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("AB3XZ");
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });
});