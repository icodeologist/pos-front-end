import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import AdminRegister from "./pages/adminRegister";
import AdminLogin from "./pages/adminLogin";
import CustomerLookup from "./pages/CustomerLookup";
import Home from "./pages/Homepage";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import { RoleProvider, useRole } from "./context/RoleContext";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import AppShell from "./components/layout/AppShell";
import CreditSystem from "./pages/CreditSystem";
import Reports from "./pages/Reports";
import Stock from "./pages/Stock";
import Welcome from "./pages/Welcome";

function ProtectedApp() {
  const { isAuthenticated } = useRole();
  return isAuthenticated ? <AppShell /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route element={<ProtectedApp />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/customer/register" element={<CustomerLookup />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<CreateProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/credit" element={<CreditSystem />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>

  );
}

export default App;
