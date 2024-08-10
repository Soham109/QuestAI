// components/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Set the persistence to local to retain authentication across sessions
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Persistence set successfully
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error setting persistence:", error);
      });

    // Listen for authentication state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};