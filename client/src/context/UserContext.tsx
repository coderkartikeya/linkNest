'use client';
import { createContext, useContext, useState, useEffect, ReactNode, SetStateAction } from 'react';


interface UserContextType {
  username: string;
  fullName: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  profilePic: string;
  createdOn: string;
  setUserContext: (data: {
    username: string;
    fullName: string;
    email: string;
    refreshToken: string;
    accessToken: string;
    profilePic: string;
    createdOn: string;
  }) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    email: '',
    refreshToken: '',
    accessToken: '',
    profilePic: '',
    createdOn: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setUserContext = (data: SetStateAction<{ username: string; fullName: string; email: string; refreshToken: string; accessToken: string; profilePic: string; createdOn: string; }>) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  return (
    <UserContext.Provider value={{ ...user, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
