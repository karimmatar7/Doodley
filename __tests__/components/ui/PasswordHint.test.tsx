import { render, screen } from "@testing-library/react";
import PasswordHint from "../../../components/ui/PasswordHint";

describe("PasswordHint", () => {
  it("renders nothing for an empty password", () => {
    const { container } = render(<PasswordHint password="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows missing rules for a weak password", () => {
    render(<PasswordHint password="abc" />);
    expect(screen.getByText(/Minimum 8 characters/)).toBeInTheDocument();
  });

  it("shows a confirmation for a strong password", () => {
    render(<PasswordHint password="Doodley1!" />);
    expect(screen.getByText(/meets all requirements/)).toBeInTheDocument();
  });
});