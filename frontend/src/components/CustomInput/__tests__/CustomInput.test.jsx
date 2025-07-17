import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomInput from "../index";

describe("CustomInput", () => {
  it("renders the input with correct label and placeholder", () => {
    render(
      <CustomInput
        type="text"
        label="Name"
        value=""
        onChange={() => {}}
        placeholder="Enter your name"
        helperText="Help"
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
  });

  it("calls onChange when typing in the input", () => {
    const handleChange = vi.fn();
    render(
      <CustomInput
        type="text"
        label="Name"
        value=""
        onChange={handleChange}
        placeholder="Enter your name"
      />
    );
    const input = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(input, { target: { value: "John" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders the value correctly", () => {
    render(
      <CustomInput
        type="text"
        label="Name"
        value="Test value"
        onChange={() => {}}
        placeholder="Enter your name"
      />
    );
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input.value).toBe("Test value");
  });
});
