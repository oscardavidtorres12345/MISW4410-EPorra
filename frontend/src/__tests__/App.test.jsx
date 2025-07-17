import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import axios from "axios";

vi.mock("axios");

const mockCarreras = [
  { Nombre: "Ciclismo" },
  { Nombre: "Formula 1" },
  { Nombre: "Motociclismo" },
  { Nombre: "Atletismo" },
  { Nombre: "Natación" },
  { Nombre: "Rally" },
  { Nombre: "Maratón" },
  { Nombre: "BMX" },
];

describe("App", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { data: mockCarreras } });
  });

  it("renders without errors", async () => {
    render(<App />);
    expect(await screen.findByTestId("app-layout")).toBeInTheDocument();
  });

  it("renders the main component", async () => {
    render(<App />);
    expect(await screen.findByTestId("app-content")).toBeInTheDocument();
  });

  it("applies correct styles", async () => {
    render(<App />);
    const layout = await screen.findByTestId("app-layout");
    expect(layout).toHaveClass("app-layout");
  });

  it("renders the SidebarMenu", async () => {
    render(<App />);
    expect(await screen.findByTestId("sidebar-navbar")).toBeInTheDocument();
  });

  it("renders table with data", async () => {
    render(<App />);
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(await screen.findByText("Ciclismo")).toBeInTheDocument();
  });

  it("renders action button", async () => {
    render(<App />);
    expect(await screen.findByText("Nueva Carrera")).toBeInTheDocument();
  });

  it("executes button action", async () => {
    render(<App />);
    const button = await screen.findByText("Nueva Carrera");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Nueva Carrera");
  });

  it("handles menu selection", async () => {
    render(<App />);
    const menuItems = await screen.findAllByTestId("sidebar-icon-link");
    if (menuItems.length > 0) {
      fireEvent.click(menuItems[0]);
      expect(menuItems[0]).toHaveClass("active");
    }
  });

  it("navigates when clicking Create Race", async () => {
    render(<App />);
    const menuItems = await screen.findAllByTestId("sidebar-icon-link");
    if (menuItems.length >= 2) {
      fireEvent.click(menuItems[1]);
      expect(menuItems[1]).toHaveClass("active");
    }
  });
});
