import { HashRouter, Routes, Route } from "react-router";
import HomePage from "./pages/Home";
import CategoriesPage from "./pages/Categories";
import { AppContainer } from "./components/layout/AppContainer";

export default function AppRouter() {
  return (
    <HashRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  );
}
