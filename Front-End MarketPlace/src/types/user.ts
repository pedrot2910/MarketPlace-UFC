export type User = {
    id: string;
    name: string;
    email: string;
    role?: 'student' | 'teacher' | 'TAE' | 'staff';
}