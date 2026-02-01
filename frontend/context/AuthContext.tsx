/**
 * Authentication Context Module
 *
 * This module provides authentication state and functions to the entire app.
 * It handles:
 * - Storing the logged-in user's information
 * - Login and registration functions
 * - Logout functionality
 * - Automatic token validation on page load
 *
 * Usage: Wrap your app with <AuthProvider>, then use the useAuth() hook
 * in any component to access auth state and functions.
 */

"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Type definition for a logged-in user
interface User {
    id: number;
    email: string;
    organization_name: string;
    is_admin: boolean;  // Admin users can send invites
}

// Type definition for the auth context (what useAuth() returns)
interface AuthContextType {
    user: User | null;              // Current user, or null if not logged in
    token: string | null;           // JWT token for API requests
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, organizationName: string, inviteToken: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;             // True while checking if user is already logged in
}

// Create the context (starts as undefined, will be set by AuthProvider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * Wraps the app and provides authentication state to all child components.
 * On mount, it checks localStorage for an existing token and validates it.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // Start loading until we check for existing token

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    /**
     * Fetch user data from the API using a token.
     * Used on initial load to validate stored tokens.
     */
    const fetchUser = useCallback(async (authToken: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Token is invalid or expired - clear it
                localStorage.removeItem("auth_token");
                setToken(null);
            }
        } catch {
            // Network error - fail silently
        }
        setIsLoading(false);
    }, [baseUrl]);

    // On component mount, check if user is already logged in
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- auth initialization on mount
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, [fetchUser]);

    /**
     * Log in with email and password.
     * On success, stores the token and user data.
     */
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to localStorage for persistence across page reloads
                localStorage.setItem("auth_token", data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Login failed" };
            }
        } catch {
            return { success: false, error: "Network error" };
        }
    };

    /**
     * Register a new account using an invite token.
     * On success, stores the token and user data (logs user in immediately).
     */
    const register = async (email: string, password: string, organizationName: string, inviteToken: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    organization_name: organizationName,
                    invite_token: inviteToken,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("auth_token", data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Registration failed" };
            }
        } catch {
            return { success: false, error: "Network error" };
        }
    };

    /**
     * Log out the current user.
     * Clears the token from localStorage and resets state.
     */
    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth Hook
 *
 * Use this in any component to access authentication state and functions.
 * Must be used within an AuthProvider.
 *
 * Example:
 *   const { user, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
