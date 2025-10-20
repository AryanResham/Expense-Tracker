import React, { createContext, useState, useEffect } from "react";
import { auth, googleAuth } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut, getAdditionalUserInfo } from "firebase/auth";
import { completeLogin, completeLogout } from "../services/auth";
import { checkExistingSession } from "../services/sessionManager";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface AuthContextType {
    user: any;
    loading: boolean;
    signUpWithEmail: (email: string, password: string) => Promise<any>;
    logInWithEmail: (email: string, password: string) => Promise<any>;
    signOutUser: () => Promise<void>;
    signInWithGoogle: () => Promise<any>;
    updateUserProfile: (displayName: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = (props: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on app startup
    useEffect(() => {
        const initAuth = async () => {
            try {
                const existingUser = await checkExistingSession();
                if (existingUser) {
                    setUser(existingUser);
                }
            } catch (error) {
                console.log("No existing session found");
            } finally {
                setLoading(false);
            }
        };
        
        initAuth();
    }, []);

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            const firebaseResult = await createUserWithEmailAndPassword(auth, email, password);
            const backendUser = await completeLogin(firebaseResult.user);
            setUser(backendUser);
            return { firebaseUser: firebaseResult.user, backendUser };
        } catch (error) {
            // Rollback Firebase account if backend fails
            if (auth.currentUser) {
                await auth.currentUser.delete().catch(console.error);
            }
            console.error("Error signing up", error);
            throw error;
        }
    }

    const logInWithEmail = async (email: string, password: string) => {
        try {
            const firebaseResult = await signInWithEmailAndPassword(auth, email, password);
            console.log("Firebase login successful", firebaseResult.user);
            const backendUser = await completeLogin(firebaseResult.user);
            setUser(backendUser);
            return { firebaseUser: firebaseResult.user, backendUser };
        } catch (error) {
            // Rollback Firebase login if backend fails
            if (auth.currentUser) {
                await signOut(auth).catch(console.error);
            }
            console.error("Error logging in", error);
            throw error;
        }
    }

    const signInWithGoogle = async () => {
        try {
            const firebaseResult = await signInWithPopup(auth, googleAuth);
            const isNewUser = getAdditionalUserInfo(firebaseResult)?.isNewUser;
            const backendUser = await completeLogin(firebaseResult.user);
            setUser(backendUser);
            return { firebaseUser: firebaseResult.user, backendUser, isNewUser };
        } catch (error) {
            // Rollback Firebase login if backend fails
            if (auth.currentUser) {
                const isNewUser = getAdditionalUserInfo({ user: auth.currentUser } as any)?.isNewUser;
                if (isNewUser) {
                    await auth.currentUser.delete().catch(console.error);
                } else {
                    await signOut(auth).catch(console.error);
                }
            }
            console.error("Error signing in with Google", error);
            throw error;
        }
    }

    const updateUserProfile = async (displayName: string) => {
        if (auth.currentUser) {
            try {
                await updateProfile(auth.currentUser, { displayName });
            } catch (error) {
                console.error("Error updating user profile", error);
                throw error;
            }
        }
    }

    const signOutUser = async () => {
        try {
            await completeLogout(); // Backend logout
            await signOut(auth);    // Firebase logout
            setUser(null);
        } catch (error) {
            // Even if backend logout fails, still logout from Firebase
            await signOut(auth).catch(console.error);
            setUser(null);
            console.error("Error signing out", error);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            signUpWithEmail, 
            logInWithEmail, 
            signOutUser, 
            signInWithGoogle, 
            updateUserProfile 
        }}>
            {loading ? <div className="flex items-center justify-center h-dvh"><Spinner variant="circle" className = "text-gray-800"  size = {50}/></div> : props.children}
        </AuthContext.Provider>
    );
};
