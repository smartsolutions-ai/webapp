'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { auth } from '~/lib/firebaseConfig';

// Define types for the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (firebaseUser: any) => {
      if (firebaseUser) {
        console.log('User is authenticated:', firebaseUser);
        setUser(firebaseUser);

        try {
          const token = await firebaseUser.getIdToken(true); // Get Firebase ID token
          // Send the token to the server or set it as a cookie
          document.cookie = `token=${token}; path=/`;
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      } else {
        console.log('No user is authenticated');
        setUser(null);
        document.cookie =
          'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'; // Clear cookie
      }
      setLoading(false); // Stop loading once the user state is updated
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await fetchUserData(firebaseUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  );
};

export default Providers; 