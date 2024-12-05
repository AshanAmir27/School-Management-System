import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SuperAdminLogin from "./components/superAdminLogin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/superAdminLogin" element={<SuperAdminLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
