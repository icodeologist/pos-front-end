import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRegister from "./pages/adminRegister";
import AdminLogin from "./pages/adminLogin";
import CustomerLookup from "./pages/CustomerLookup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/customer/register" element={<CustomerLookup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
