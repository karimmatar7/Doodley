import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../../components/ui/Button";

describe("Button", () => {
  it("renders the children text", () => {
    render(<Button>Log in</Button>);
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Loading</Button>);
    expect(screen.getByText("Loading")).toBeDisabled();
  });
});