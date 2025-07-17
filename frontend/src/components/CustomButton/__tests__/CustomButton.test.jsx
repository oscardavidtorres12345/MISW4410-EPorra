import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomButton from "../index";

describe("CustomButton", () => {
  it("renders with correct text", () => {
    render(<CustomButton onClick={() => {}}>Test Button</CustomButton>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<CustomButton onClick={mockOnClick}>Click me</CustomButton>);

    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has correct CSS class", () => {
    render(<CustomButton onClick={() => {}}>Test</CustomButton>);
    const button = screen.getByText("Test");
    expect(button).toHaveClass("custom-btn");
  });

  it("renders as a button element", () => {
    render(<CustomButton onClick={() => {}}>Test</CustomButton>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
