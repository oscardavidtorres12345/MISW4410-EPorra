import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "../index";

describe("Loading", () => {
  it("renders spinner", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(document.querySelector(".spinner-border")).toBeInTheDocument();
  });
});
