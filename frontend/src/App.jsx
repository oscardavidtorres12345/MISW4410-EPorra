import "./styles/layout.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarMenu from "./components/SidebarMenu";
import RaceList from "./pages/RaceList";
import RaceCreate from "./pages/RaceCreate";
import { useNavigation } from "./hooks/useNavigation";

function AppWithRouter() {
  const { menuItems, activeMenu, handleMenuSelect } = useNavigation();

  return (
    <div className="app-layout" data-testid="app-layout">
      <SidebarMenu
        items={menuItems}
        activeIndex={activeMenu}
        onSelect={handleMenuSelect}
        data-testid="sidebar-navbar"
      />
      <div className="app-content" data-testid="app-content">
        <Routes>
          <Route path="/" element={<RaceList />} />
          <Route path="/create" element={<RaceCreate />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

export default App;
