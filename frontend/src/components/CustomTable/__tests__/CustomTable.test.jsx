import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CustomTable from "../index";

describe("CustomTable", () => {
  const mockHeaders = ["Name", "Age", "City"];
  const mockData = [
    ["John", 25, "New York"],
    ["Jane", 30, "Los Angeles"],
    ["Bob", 35, "Chicago"],
  ];

  it("renders headers correctly", () => {
    render(<CustomTable headers={mockHeaders} data={mockData} />);

    mockHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("renders data correctly", () => {
    render(<CustomTable headers={mockHeaders} data={mockData} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
  });

  it("renders with object data", () => {
    const objectData = [
      { Name: "John", Age: 25, City: "New York" },
      { Name: "Jane", Age: 30, City: "Los Angeles" },
    ];

    render(<CustomTable headers={mockHeaders} data={objectData} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("has correct table structure", () => {
    render(<CustomTable headers={mockHeaders} data={mockData} />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("table");
  });

  it("renders empty data correctly", () => {
    render(<CustomTable headers={mockHeaders} data={[]} />);

    mockHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
});
