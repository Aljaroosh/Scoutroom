  import { BrowserRouter, Routes, Route } from "react-router";
  import Layout from "./components/Layout";
  import HomePage from "./pages/HomePage";
  import LoginPage from "./pages/LoginPage";
  import RegisterPage from "./pages/RegisterPage";
  import TiersPage from "./pages/TiersPage";
  import CheckoutPage from "./pages/CheckoutPage";
  import ThankYouPage from "./pages/ThankYouPage";
  import AccountPage from "./pages/AccountPage";
  import NotFoundPage from "./pages/NotFoundPage";
  import ProtectedRoute from "./components/ProtectedRoute";

  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tiers" element={<TiersPage />} />
            <Route element={<ProtectedRoute />}>
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/thank-you" element={<ThankYouPage />} />
    <Route path="/account" element={<AccountPage />} />
          </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }