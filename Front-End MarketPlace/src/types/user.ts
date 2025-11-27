export type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
    photoUrl?: string;
    role?: 'student' | 'teacher' | 'TAE' | 'staff';
}