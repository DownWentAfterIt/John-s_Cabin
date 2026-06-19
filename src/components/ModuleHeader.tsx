import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gamepad2, Monitor, Package, Plus, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ModuleHeaderProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addLabel?: string;
}

const modules = [
  { path: "/", icon: Gamepad2, label: "Games", title: "John's Cabin", subtitle: "Track my Gaming Life" },
  { path: "/devices", icon: Monitor, label: "Devices", title: "John's Devices", subtitle: "Manage my electronic devices" },
  { path: "/edc", icon: Package, label: "EDC", title: "John's EDC", subtitle: "My Everyday Carry" },
];

export function ModuleHeader({ title, subtitle, onAdd, addLabel = "Add" }: ModuleHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated } = useAuth();

  const currentModule = modules.find(m => m.path === location.pathname) || modules[0];

  const handleModuleSelect = (path: string) => {
    setShowMenu(false);
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            {/* 可点击的图标按钮 */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-opacity"
            >
              <currentModule.icon className="w-6 h-6 text-white" />
            </button>
            
            {/* 标题区域 */}
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>

            {/* 模块选择下拉菜单 */}
            {showMenu && (
              <>
                {/* 背景遮罩 */}
                <div 
                  className="fixed inset-0 z-50" 
                  onClick={() => setShowMenu(false)}
                />
                
                {/* 下拉菜单 */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-slate-700/50">
                    <p className="text-xs text-slate-400 px-2">Switch Module</p>
                  </div>
                  {modules.map((module) => {
                    const Icon = module.icon;
                    const isActive = module.path === location.pathname;
                    return (
                      <button
                        key={module.path}
                        onClick={() => handleModuleSelect(module.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/50 transition-colors ${
                          isActive ? "bg-slate-700/30" : ""
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-blue-600" : "bg-slate-700"}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="flex-1 text-left text-sm text-white">{module.label}</span>
                        {isActive && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 添加按钮 - 仅在登录状态下显示 */}
          {isAuthenticated && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">{addLabel}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
