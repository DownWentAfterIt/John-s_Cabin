import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string, captcha: string) => boolean;
  logout: () => void;
  currentCaptcha: string;
  refreshCaptcha: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'johnsCabin2024';

function generateCaptcha(): { display: string; answer: string } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'] as const;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer: number;
  let display: string;
  
  switch (operator) {
    case '+':
      answer = num1 + num2;
      display = `${num1} + ${num2}`;
      break;
    case '-':
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      answer = max - min;
      display = `${max} - ${min}`;
      break;
    case '*':
      answer = num1 * num2;
      display = `${num1} × ${num2}`;
      break;
    default:
      answer = num1 + num2;
      display = `${num1} + ${num2}`;
  }
  
  return { display, answer: answer.toString() };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [captcha, setCaptcha] = useState<{ display: string; answer: string }>(generateCaptcha);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string, captchaInput: string): boolean => {
    if (password === ADMIN_PASSWORD && captchaInput === captcha.answer) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      refreshCaptcha();
      return true;
    }
    refreshCaptcha();
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, currentCaptcha: captcha.display, refreshCaptcha }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
