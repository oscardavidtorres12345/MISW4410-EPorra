import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AddList from "../index";

const defaultProps = {
  label: "Add competitors",
  firstField: "Name",
  secondField: "Probability",
  firstFieldType: "text",
  secondFieldType: "number",
  onDataChange: () => {},
};

describe("AddList", () => {
  let container;

  beforeEach(() => {
    container = render(<AddList {...defaultProps} />).container;
  });

  it("renders the component without errors", () => {
    expect(container.querySelector(".add-list-container")).toBeInTheDocument();
    expect(screen.getByText("Add competitors")).toBeInTheDocument();
  });

  it("shows the input fields after clicking add button", () => {
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText("Ingrese name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingrese probability")
    ).toBeInTheDocument();
  });

  it("adds an item to the list", () => {
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText("Ingrese name");
    const probInput = screen.getByPlaceholderText("Ingrese probability");
    const saveButton = container.querySelector(".custom-btn-primary");

    fireEvent.change(nameInput, { target: { value: "Competitor 1" } });
    fireEvent.change(probInput, { target: { value: "0.5" } });
    fireEvent.click(saveButton);

    expect(screen.getByText("Competitor 1")).toBeInTheDocument();
    expect(screen.getByText("0.5")).toBeInTheDocument();
  });

  it("calls onDataChange when saving an item", () => {
    const mockOnDataChange = vi.fn();
    const { container: newContainer } = render(
      <AddList {...defaultProps} onDataChange={mockOnDataChange} />
    );

    const addButton = newContainer.querySelector(".add-list-plus-btn");
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText("Ingrese name");
    const probInput = screen.getByPlaceholderText("Ingrese probability");
    const saveButton = newContainer.querySelector(".custom-btn-primary");

    fireEvent.change(nameInput, { target: { value: "Test Competitor" } });
    fireEvent.change(probInput, { target: { value: "0.7" } });
    fireEvent.click(saveButton);

    expect(mockOnDataChange).toHaveBeenCalledWith([
      { firstFieldValue: "Test Competitor", secondFieldValue: "0.7" },
    ]);
  });

  it("removes an item from the list", () => {
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    const nameInput = screen.getByPlaceholderText("Ingrese name");
    const probInput = screen.getByPlaceholderText("Ingrese probability");
    const saveButton = container.querySelector(".custom-btn-primary");

    fireEvent.change(nameInput, { target: { value: "Competitor 2" } });
    fireEvent.change(probInput, { target: { value: "0.3" } });
    fireEvent.click(saveButton);

    expect(screen.getByText("Competitor 2")).toBeInTheDocument();
  });

  it("hides input fields when cancel is clicked", () => {
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText("Ingrese name")).toBeInTheDocument();
    const cancelButton = container.querySelectorAll(".add-list-action-btn")[1];
    fireEvent.click(cancelButton);

    expect(screen.queryByPlaceholderText("Ingrese name")).toBeNull();
  });

  it("calls onDataChange when deleting an item", () => {
    const mockOnDataChange = vi.fn();
    const { container: newContainer } = render(
      <AddList {...defaultProps} onDataChange={mockOnDataChange} />
    );
    const addButton = newContainer.querySelector(".add-list-plus-btn");
    fireEvent.click(addButton);
    const nameInput = screen.getByPlaceholderText("Ingrese name");
    const probInput = screen.getByPlaceholderText("Ingrese probability");
    const saveButton = newContainer.querySelector(".custom-btn-primary");
    fireEvent.change(nameInput, { target: { value: "ToDelete" } });
    fireEvent.change(probInput, { target: { value: "0.9" } });
    fireEvent.click(saveButton);

    const deleteButton = newContainer
      .querySelector(".bi-trash")
      .closest("button");
    fireEvent.click(deleteButton);
    expect(mockOnDataChange).toHaveBeenCalledWith([]);
  });
});
