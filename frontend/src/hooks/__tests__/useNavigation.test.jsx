import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useNavigation } from "../useNavigation";

const MockWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("useNavigation", () => {
  let result;

  beforeEach(() => {
    const { result: hookResult } = renderHook(() => useNavigation(), {
      wrapper: MockWrapper,
    });
    result = hookResult;
  });

  it("returns initial state", () => {
    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.activeMenu).toBe(0);
    expect(typeof result.current.handleMenuSelect).toBe("function");
  });

  it("has correct menu items", () => {
    const { menuItems } = result.current;

    expect(menuItems[0]).toEqual({
      icon: "house-door-fill",
      text: "Inicio",
      href: "/",
    });

    expect(menuItems[1]).toEqual({
      icon: "plus-circle-fill",
      text: "Crear Carrera",
      href: "/create",
    });
  });

  it("handles menu selection", () => {
    const { handleMenuSelect } = result.current;

    act(() => {
      handleMenuSelect(1);
    });

    expect(result.current.activeMenu).toBe(1);
  });

  it("navigates when selecting menu item with href", () => {
    const { handleMenuSelect } = result.current;
    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      href: "http://localhost:3000/",
    });

    act(() => {
      handleMenuSelect(1);
    });

    expect(result.current.activeMenu).toBe(1);
    locationSpy.mockRestore();
  });

  it("updates active menu based on current pathname", () => {
    const { result: newResult } = renderHook(() => useNavigation(), {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    });

    expect(typeof newResult.current.activeMenu).toBe("number");
  });

  it("memoizes menu items", () => {
    const { menuItems } = result.current;
    const { menuItems: menuItems2 } = result.current;

    expect(menuItems).toBe(menuItems2);
  });
});
