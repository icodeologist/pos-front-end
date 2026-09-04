import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./pages/adminRegister";
import AdminLogin from "./pages/adminLogin";
import CustomerLookup from "./pages/CustomerLookup";
import Home from "./pages/Homepage";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import { RoleProvider } from "./context/RoleContext";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import AppShell from "./components/layout/AppShell";

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AppShell />}>
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/customer/register" element={<CustomerLookup />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<CreateProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>

  );
}

export default App;
