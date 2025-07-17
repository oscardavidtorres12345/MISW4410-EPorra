import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SidebarMenu from "../index";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("SidebarMenu - Desktop Mode", () => {
  const mockItems = [
    { icon: "house-fill", text: "Home", href: "#" },
    { icon: "people-fill", text: "Users", href: "#" },
    { icon: "gear-fill", text: "Settings", href: "#" },
  ];

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders menu items correctly", () => {
    render(<SidebarMenu items={mockItems} />);

    const icons = document.querySelectorAll(".bi");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("calls onSelect when menu item is clicked", () => {
    const mockOnSelect = vi.fn();
    render(<SidebarMenu items={mockItems} onSelect={mockOnSelect} />);

    const menuItems = document.querySelectorAll(".sidebar-icon-link");
    fireEvent.click(menuItems[0]);

    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  it("highlights active menu item", () => {
    render(<SidebarMenu items={mockItems} activeIndex={1} />);

    const menuItems = document.querySelectorAll(".sidebar-icon-link");
    expect(menuItems[1]).toHaveClass("active");
    expect(menuItems[0]).toHaveClass("inactive");
  });

  it("renders navbar in desktop mode", () => {
    render(<SidebarMenu items={mockItems} />);

    const navbar = document.querySelector(".sidebar-navbar");
    expect(navbar).toBeInTheDocument();
  });

  it("detects desktop mode with exact boundary value 768", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<SidebarMenu items={mockItems} />);

    const navbar = document.querySelector(".sidebar-navbar");
    expect(navbar).toBeInTheDocument();
  });

  it("detects desktop mode with large value", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });

    render(<SidebarMenu items={mockItems} />);

    const navbar = document.querySelector(".sidebar-navbar");
    expect(navbar).toBeInTheDocument();
  });
});

describe("SidebarMenu - Mobile Mode", () => {
  const mockItems = [
    { icon: "house-fill", text: "Home", href: "#" },
    { icon: "people-fill", text: "Users", href: "#" },
    { icon: "gear-fill", text: "Settings", href: "#" },
  ];

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  it("renders menu items correctly", () => {
    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    fireEvent.click(mobileButton);

    const icons = document.querySelectorAll(".bi");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("calls onSelect when menu item is clicked", () => {
    const mockOnSelect = vi.fn();
    render(<SidebarMenu items={mockItems} onSelect={mockOnSelect} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    fireEvent.click(mobileButton);

    const menuItems = document.querySelectorAll(".sidebar-icon-link");
    fireEvent.click(menuItems[0]);

    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  it("highlights active menu item", () => {
    render(<SidebarMenu items={mockItems} activeIndex={1} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    fireEvent.click(mobileButton);

    const menuItems = document.querySelectorAll(".sidebar-icon-link");
    expect(menuItems[1]).toHaveClass("active");
    expect(menuItems[0]).toHaveClass("inactive");
  });

  it("renders mobile button", () => {
    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    expect(mobileButton).toBeInTheDocument();
  });

  it("detects mobile mode with exact boundary value 767", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 767,
    });

    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    expect(mobileButton).toBeInTheDocument();
  });

  it("detects mobile mode with value 0", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 0,
    });

    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    expect(mobileButton).toBeInTheDocument();
  });

  it("opens offcanvas when mobile button is clicked", () => {
    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    fireEvent.click(mobileButton);

    const offcanvas = document.querySelector(".offcanvas");
    expect(offcanvas).toHaveClass("show");
  });

  it("closes offcanvas when close button is clicked", () => {
    render(<SidebarMenu items={mockItems} />);

    const mobileButton = document.querySelector(".sidebar-mobile-btn");
    fireEvent.click(mobileButton);

    const closeButton = document.querySelector(".btn-close");
    fireEvent.click(closeButton);

    const offcanvas = document.querySelector(".offcanvas");
    expect(offcanvas).not.toHaveClass("show");
  });
});
