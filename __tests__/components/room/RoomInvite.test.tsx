import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import RoomInvite from "@/components/room/RoomInvite";

describe("RoomInvite", () => {
  const code = "V7SSJ";
  const joinUrl = "http://localhost:3000/room/V7SSJ";

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest
          .fn()
          .mockResolvedValue(undefined),
      },
    });
  });

  it("renders the room code and QR code for the host", () => {
    render(
      <RoomInvite
        code={code}
        joinUrl={joinUrl}
        isHost={true}
      />
    );

    expect(
      screen.getByText("Invite friends")
    ).toBeInTheDocument();

    expect(
      screen.getByText(code)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Scan to join")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: `QR code to join room ${code}`,
      })
    ).toBeInTheDocument();
  });

  it("renders the QR code as an SVG", () => {
    render(
      <RoomInvite
        code={code}
        joinUrl={joinUrl}
        isHost={true}
      />
    );

    const qrCode = screen.getByRole("img", {
      name: `QR code to join room ${code}`,
    });

    expect(qrCode.tagName.toLowerCase()).toBe("svg");

    expect(qrCode).toHaveAttribute(
      "aria-label",
      "QR code to join room V7SSJ"
    );
  });

  it("copies the room code", async () => {
    render(
      <RoomInvite
        code={code}
        joinUrl={joinUrl}
        isHost={true}
      />
    );

    const copyButton = screen.getByRole("button", {
      name: `Copy room code ${code}`,
    });

    fireEvent.click(copyButton);

    expect(
      navigator.clipboard.writeText
    ).toHaveBeenCalledWith(code);
  });

  it("does not render for a non-host", () => {
    render(
      <RoomInvite
        code={code}
        joinUrl={joinUrl}
        isHost={false}
      />
    );

    expect(
      screen.queryByText("Invite friends")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("img", {
        name: `QR code to join room ${code}`,
      })
    ).not.toBeInTheDocument();
  });
});