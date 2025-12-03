export type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
    photoUrl?: string;
    role?: 'estudante' | 'Docente' | 'TAE' | 'staff';
}