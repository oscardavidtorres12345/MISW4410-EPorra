import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useNavigation = () => {
  const [activeMenu, setActiveMenu] = useState(0);
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      { icon: "house-door-fill", text: "Inicio", href: "/" },
      { icon: "plus-circle-fill", text: "Crear Carrera", href: "/create" },
    ],
    []
  );

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) => item.href === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveMenu(currentIndex);
    }
  }, [location.pathname, menuItems]);

  const handleMenuSelect = (idx) => {
    setActiveMenu(idx);
    if (menuItems[idx].href !== "#") {
      window.location.href = menuItems[idx].href;
    }
  };

  return {
    menuItems,
    activeMenu,
    handleMenuSelect,
  };
};
