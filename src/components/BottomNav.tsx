import { Gamepad2, Monitor, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/", icon: Gamepad2, label: "Games" },
  { path: "/devices", icon: Monitor, label: "Devices" },
  { path: "/edc", icon: Package, label: "EDC" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // 获取当前激活的路径
  const currentPath = location.pathname.split("/")[1] || "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = 
              (item.path === "/" && currentPath === "") ||
              (item.path !== "/" && currentPath === item.path.slice(1));
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-blue-400" : ""}`} />
                <span className={`text-xs font-medium ${isActive ? "text-blue-400" : ""}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-12 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
