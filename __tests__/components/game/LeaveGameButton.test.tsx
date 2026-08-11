import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import LeaveGameButton from "@/components/game/LeaveGameButton";

describe("LeaveGameButton", () => {
  it("renders a Leave game button", () => {
    render(<LeaveGameButton onConfirmLeave={jest.fn()} />);

    expect(
      screen.getByRole("button", { name: "Leave game" })
    ).toBeInTheDocument();
  });

  it("opens a confirmation dialog when clicked", async () => {
    const user = userEvent.setup();
    render(<LeaveGameButton onConfirmLeave={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Leave game" }));

    expect(
      await screen.findByRole("dialog", {
        name: "Leave game confirmation",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to leave the game?")
    ).toBeInTheDocument();
  });

  it("does not call onConfirmLeave when Cancel is clicked", async () => {
    const onConfirmLeave = jest.fn();
    const user = userEvent.setup();
    render(<LeaveGameButton onConfirmLeave={onConfirmLeave} />);

    await user.click(screen.getByRole("button", { name: "Leave game" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirmLeave).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { name: "Leave game confirmation" })
    ).not.toBeInTheDocument();
  });

  it("calls onConfirmLeave when Leave is confirmed", async () => {
    const onConfirmLeave = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LeaveGameButton onConfirmLeave={onConfirmLeave} />);

    await user.click(screen.getByRole("button", { name: "Leave game" }));
    await user.click(screen.getByRole("button", { name: "Leave" }));

    await waitFor(() => {
      expect(onConfirmLeave).toHaveBeenCalledTimes(1);
    });
  });

  it("closes the dialog after a successful leave", async () => {
    const onConfirmLeave = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LeaveGameButton onConfirmLeave={onConfirmLeave} />);

    await user.click(screen.getByRole("button", { name: "Leave game" }));
    await user.click(screen.getByRole("button", { name: "Leave" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Leave game confirmation" })
      ).not.toBeInTheDocument();
    });
  });

  it("disables the trigger button when the disabled prop is set", () => {
    render(<LeaveGameButton onConfirmLeave={jest.fn()} disabled />);

    expect(screen.getByRole("button", { name: "Leave game" })).toBeDisabled();
  });
});