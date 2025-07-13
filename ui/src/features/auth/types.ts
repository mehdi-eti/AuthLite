/** @format */

export interface User {
	id: string;
	email: string;
	role: "ADMIN" | "USER" | "MODERATOR";
	username?: string;
}

export interface AuthContextProps {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setUser: (user: User | null) => void;
}
