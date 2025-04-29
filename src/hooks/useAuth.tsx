
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  balance: number;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedBalance = localStorage.getItem('balance');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedBalance) {
      setBalance(Number(storedBalance));
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save balance to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  const login = async (email: string, password: string) => {
    // This is a mock implementation - in a real app, you would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password) {
          const mockUser = {
            id: '1',
            username: email.split('@')[0],
            email,
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          // Check if this user has a stored balance
          const storedBalance = localStorage.getItem(`balance_${mockUser.id}`);
          if (storedBalance) {
            setBalance(Number(storedBalance));
          } else {
            setBalance(0); // Default balance for new users
          }
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const register = async (username: string, email: string, password: string) => {
    // This is a mock implementation - in a real app, you would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (username && email && password) {
          const newUser = {
            id: `user_${Date.now()}`,
            username,
            email,
          };
          setUser(newUser);
          setIsAuthenticated(true);
          setBalance(0); // Default balance for new users
          resolve();
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 500);
    });
  };

  const logout = () => {
    // Save user-specific balance before logout
    if (user) {
      localStorage.setItem(`balance_${user.id}`, balance.toString());
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      balance, 
      isAuthenticated, 
      login, 
      register,
      logout,
      updateBalance
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
