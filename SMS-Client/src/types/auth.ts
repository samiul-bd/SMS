export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Teacher' | 'Student';
}

export interface LoginResponse {
    token: string;
    user: User;
}