import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import DetailEdit from "@/pages/DetailEdit";
import Devices from "@/pages/Devices";
import DeviceDetailEdit from "@/pages/DeviceDetailEdit";
import EDC from "@/pages/EDC";
import EDCItemDetailEdit from "@/pages/EDCItemDetailEdit";
import EDCSetupDetailEdit from "@/pages/EDCSetupDetailEdit";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminIndicator } from "@/components/LoginModal";

function AppContent() {
  const location = useLocation();
  // 在详情编辑页面不显示底部导航
  const showBottomNav = 
    !location.pathname.startsWith("/edit/") &&
    !location.pathname.startsWith("/devices/edit/") &&
    !location.pathname.startsWith("/edc/items/edit/") &&
    !location.pathname.startsWith("/edc/setups/edit/");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<DetailEdit />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/edit/:id" element={<DeviceDetailEdit />} />
        <Route path="/edc" element={<EDC />} />
        <Route path="/edc/items/edit/:id" element={<EDCItemDetailEdit />} />
        <Route path="/edc/setups/edit/:id" element={<EDCSetupDetailEdit />} />
      </Routes>
      {showBottomNav && <BottomNav />}
      <AdminIndicator />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
