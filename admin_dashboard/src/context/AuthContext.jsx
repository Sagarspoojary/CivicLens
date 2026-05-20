/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, isRealConfig } from "../firebase/config";
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PREDEFINED_USERS, initializeSimulatedData } from "../firebase/seeder";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("civiclens_current_user");
      if (!stored || stored === "undefined" || stored === "null") return null;
      return JSON.parse(stored);
    } catch (e) {
      console.warn("AuthContext: Failed to parse user session", e);
      return null;
    }
  });
  const [userRole, setUserRole] = useState(() => {
    try {
      const stored = localStorage.getItem("civiclens_current_user");
      if (!stored || stored === "undefined" || stored === "null") return null;
      const parsed = JSON.parse(stored);
      return parsed ? parsed.role : null;
    } catch {
      return null;
    }
  });
  // Initialize loading to true only if real Firebase is active, preventing synchronous setState in effect warning
  const [loading, setLoading] = useState(!!isRealConfig);
  const [isSimulated, setIsSimulated] = useState(!isRealConfig);

  useEffect(() => {
    // Always initialize mock database in local storage
    initializeSimulatedData();

    let timeoutId;
    if (isRealConfig && auth) {
      // Set a fail-safe backup timer of 4 seconds
      timeoutId = setTimeout(() => {
        console.warn("CivicLens: Firebase connection timed out. Activating sandbox fallback.");
        setLoading(false);
        setIsSimulated(true);
      }, 4000);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (user) {
          setCurrentUser(user);
          setIsSimulated(false);
          // Fetch user role from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            } else {
              // Self-healing fallback: If they log in but their Firestore record is missing,
              // check PREDEFINED_USERS, create the Firestore record automatically, and use it.
              const matched = PREDEFINED_USERS.find(u => u.email.toLowerCase() === user.email.toLowerCase());
              const determinedRole = matched ? matched.role : "Municipality";
              const determinedName = matched ? matched.name : "Official Admin";
              
              try {
                await setDoc(doc(db, "users", user.uid), {
                  email: user.email,
                  role: determinedRole,
                  displayName: determinedName,
                  createdAt: new Date().toISOString()
                });
                console.log(`CivicLens self-healing: Stored user metadata in Firestore for ${user.email}`);
              } catch (writeErr) {
                console.error("CivicLens: Failed to auto-store user metadata in Firestore:", writeErr);
              }
              
              setUserRole(determinedRole);
            }
          } catch (e) {
            console.error("Error fetching user role", e);
            setUserRole("Municipality");
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
        setLoading(false);
      });
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        unsubscribe();
      };
    } else {
      // Fallback if real config is desired but auth services failed to initialize
      setTimeout(() => {
        setLoading(false);
        setIsSimulated(true);
      }, 0);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    if (isRealConfig && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      // Local Simulation Login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Network delay simulator
      
      const matched = PREDEFINED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!matched) {
        setLoading(false);
        throw new Error("Invalid credentials. Department official record not found.");
      }
      
      if (password !== matched.password) {
        setLoading(false);
        throw new Error("Incorrect access key for " + matched.name);
      }

      const simUser = {
        uid: "sim-" + email.split("@")[0],
        email: email,
        displayName: matched.name,
        role: matched.role,
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=" + matched.name
      };

      localStorage.setItem("civiclens_current_user", JSON.stringify(simUser));
      setCurrentUser(simUser);
      setUserRole(simUser.role);
      setLoading(false);
      return simUser;
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isRealConfig && auth) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem("civiclens_current_user");
      setCurrentUser(null);
      setUserRole(null);
    }
    setLoading(false);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    isSimulated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-[#060608] relative overflow-hidden flex flex-col justify-center items-center p-6 font-inter select-none">
          {/* Cyber grid background */}
          <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-b-purple-400 border-l-cyan-500 border-t-transparent border-r-transparent animate-spin opacity-70" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <div className="space-y-2 animate-pulse">
              <p className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-cyan-400">
                Establishing uplink
              </p>
              <h2 className="text-xl font-bold font-outfit text-white tracking-tight">
                Authorizing CivicLens Security Clearance...
              </h2>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

