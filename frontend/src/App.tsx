  import { BrowserRouter, Routes, Route } from "react-router";
  import Layout from "./components/Layout";
  import HomePage from "./pages/HomePage";
  import LoginPage from "./pages/LoginPage";
  import RegisterPage from "./pages/RegisterPage";
  import TiersPage from "./pages/TiersPage";
  import CheckoutPage from "./pages/CheckoutPage";
  import ThankYouPage from "./pages/ThankYouPage";
  import AccountPage from "./pages/AccountPage";
  import ContentPage from "./pages/ContentPage";
  import NotFoundPage from "./pages/NotFoundPage";
  import ProtectedRoute from "./components/ProtectedRoute";
  import AdminRoute from "./components/AdminRoute";
  import AdminPage from "./pages/AdminPage";
  import ContentListPage from "./pages/ContentListPage";
  import PlayersPage from "./pages/PlayersPage";
  import ScoutListPage from "./pages/ScoutListPage";

  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tiers" element={<TiersPage />} />
            <Route path="/content" element={<ContentListPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/content/:slug" element={<ContentPage />} />
            <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/scout-list" element={<ScoutListPage />} />
            <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }