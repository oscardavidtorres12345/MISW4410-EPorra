import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RaceList from "../index";
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

const MockWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("RaceList", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { data: mockCarreras } });
  });

  it("renders without errors", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    expect(await screen.findByText("Lista de carreras")).toBeInTheDocument();
  });

  it("renders the header with title", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    const header = await screen.findByText("Lista de carreras");
    expect(header).toBeInTheDocument();
  });

  it("renders the table", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("renders table with correct headers", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    expect(await screen.findByText("Carrera")).toBeInTheDocument();
  });

  it("renders table with correct data", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    for (const carrera of mockCarreras) {
      expect(await screen.findByText(carrera.Nombre)).toBeInTheDocument();
    }
  });

  it("renders action button", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    expect(await screen.findByText("Nueva Carrera")).toBeInTheDocument();
  });

  it("executes button action when clicked", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    const button = await screen.findByText("Nueva Carrera");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });

  it("renders table wrapper", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    expect(await screen.findByTestId("table-wrapper")).toBeInTheDocument();
  });

  it("has correct number of data rows", async () => {
    render(<RaceList />, { wrapper: MockWrapper });
    const rows = await screen.findAllByRole("row");
    expect(rows.length - 1).toBe(mockCarreras.length);
  });

  it("shows error message if request fails", async () => {
    const error = new Error("Error de red");
    axios.get.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RaceList />, { wrapper: MockWrapper });
    await screen.findByTestId("table-wrapper");
    expect(errorSpy).toHaveBeenCalledWith(error);
    errorSpy.mockRestore();
  });

  it("shows message when there are no races", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    render(<RaceList />, { wrapper: MockWrapper });
    expect(
      await screen.findByText(
        "¡Ups! parece que aun no hay carreras para mostrar :("
      )
    ).toBeInTheDocument();
  });
});
