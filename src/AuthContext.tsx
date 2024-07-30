import { createContext, ReactNode, useContext, useState } from "react";

export type AuthObject = {
    status: 'authenticated',
    username: string
    token: string
} | { status: 'unauthenticated' }

export type AuthStatus = AuthObject['status'];

export type AuthContext = {
    auth: AuthObject
    setAuth: React.Dispatch<React.SetStateAction<AuthObject>>
}

export const AuthContext = createContext<AuthContext | null>(null);

interface AuthContextProviderProps { children: ReactNode }

export function AuthContextProvider ({ children }: AuthContextProviderProps) {
    const [auth, setAuth] = useState<AuthObject>({ status: 'unauthenticated' });

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth () {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be called inside an AuthContextProvider');
    }

    return auth;
}
