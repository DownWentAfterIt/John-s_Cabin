import { useState } from 'react';
import { X, Lock, LogOut, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const { login, currentCaptcha, refreshCaptcha } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha.trim()) {
      setError('请输入验证码');
      return;
    }
    if (login(password, captcha)) {
      setPassword('');
      setCaptcha('');
      setError('');
      onClose();
    } else {
      setError('密码或验证码错误');
    }
  };

  const handleRefreshCaptcha = () => {
    refreshCaptcha();
    setCaptcha('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">管理员登录</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">验证码</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg">
                <span className="text-lg font-bold text-white">{currentCaptcha}</span>
                <span className="text-lg font-bold text-white">=</span>
              </div>
              <button
                type="button"
                onClick={handleRefreshCaptcha}
                className="p-3 bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700 rounded-lg transition-colors"
                title="刷新验证码"
              >
                <RefreshCw className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <input
              type="number"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="请输入计算结果"
              className="w-full mt-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminIndicator() {
  const { isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">管理员</span>
            </div>
            <button
              onClick={logout}
              className="p-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
            title="管理员登录"
          >
            <Lock className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
      
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
