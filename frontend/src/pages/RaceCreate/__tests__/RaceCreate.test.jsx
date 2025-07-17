import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RaceCreate from "../index";
import axios from "axios";

vi.mock("axios");

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("RaceCreate", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({});
  });

  it("renders without errors", () => {
    render(<RaceCreate />, { wrapper: Wrapper });
    expect(screen.getByText("Crear carrera")).toBeInTheDocument();
    expect(
      screen.getByText(/Ingresa el nombre de la carrera/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ej: Gran Premio de Mónaco")
    ).toBeInTheDocument();
    expect(screen.getByText("Guardar")).toBeInTheDocument();
  });

  it("disables save button if form is invalid", () => {
    render(<RaceCreate />, { wrapper: Wrapper });
    const saveButton = screen.getByText("Guardar");
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when form is valid", async () => {
    const { container } = render(<RaceCreate />, { wrapper: Wrapper });
    const nameInput = screen.getByPlaceholderText("Ej: Gran Premio de Mónaco");
    fireEvent.change(nameInput, { target: { value: "Gran Premio" } });

    const addButton = container.querySelector(".add-list-plus-btn");
    fireEvent.click(addButton);

    const competitorName = screen.getByPlaceholderText(/nombre/i);
    const competitorProb = screen.getByPlaceholderText(/probabilidad/i);
    fireEvent.change(competitorName, { target: { value: "Competidor 1" } });
    fireEvent.change(competitorProb, { target: { value: "1" } });

    const saveCompetitor = container.querySelector(".custom-btn-primary");
    fireEvent.click(saveCompetitor);

    const saveButton = screen.getByText("Guardar");
    await waitFor(() => expect(saveButton).not.toBeDisabled());
  });

  it("calls handleSave when clicking save", async () => {
    const { container } = render(<RaceCreate />, { wrapper: Wrapper });
    const nameInput = screen.getByPlaceholderText("Ej: Gran Premio de Mónaco");
    fireEvent.change(nameInput, { target: { value: "Gran Premio" } });

    const addButton = container.querySelector(".add-list-plus-btn");
    fireEvent.click(addButton);

    const competitorName = screen.getByPlaceholderText(/nombre/i);
    const competitorProb = screen.getByPlaceholderText(/probabilidad/i);
    fireEvent.change(competitorName, { target: { value: "Competidor 1" } });
    fireEvent.change(competitorProb, { target: { value: "1" } });

    const saveCompetitor = container.querySelector(".custom-btn-primary");
    fireEvent.click(saveCompetitor);

    const saveButton = screen.getByText("Guardar");
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/carreras"),
        expect.objectContaining({
          nombre: "Gran Premio",
          competidores: expect.any(Array),
        })
      );
    });
  });

  it("shows error in console if createRace fails", async () => {
    const error = new Error("Request failed");
    axios.post.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<RaceCreate />, { wrapper: Wrapper });
    const nameInput = screen.getByPlaceholderText("Ej: Gran Premio de Mónaco");
    fireEvent.change(nameInput, { target: { value: "Gran Premio" } });

    const addButton = container.querySelector(".add-list-plus-btn");
    fireEvent.click(addButton);

    const competitorName = screen.getByPlaceholderText(/nombre/i);
    const competitorProb = screen.getByPlaceholderText(/probabilidad/i);
    fireEvent.change(competitorName, { target: { value: "Competidor 1" } });
    fireEvent.change(competitorProb, { target: { value: "1" } });

    const saveCompetitor = container.querySelector(".custom-btn-primary");
    fireEvent.click(saveCompetitor);

    const saveButton = screen.getByText("Guardar");
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(error);
    });
    errorSpy.mockRestore();
  });
});
