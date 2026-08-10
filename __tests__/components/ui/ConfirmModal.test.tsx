import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "@/components/ui/ConfirmModal";

describe("ConfirmModal", () => {
  it("renders the title and message", () => {
    render(
      <ConfirmModal title="Unfriend Player?" message="They will lose you as a friend too." onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByText("Unfriend Player?")).toBeInTheDocument();
    expect(screen.getByText("They will lose you as a friend too.")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm is clicked", () => {
    const onConfirm = jest.fn();
    render(<ConfirmModal title="t" message="m" onConfirm={onConfirm} onCancel={() => {}} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel is clicked", () => {
    const onCancel = jest.fn();
    render(<ConfirmModal title="t" message="m" onConfirm={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});