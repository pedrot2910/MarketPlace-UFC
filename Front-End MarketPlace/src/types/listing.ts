export type Listing = {
    id: string;
    title: string;
    description: string;
    status: "ativo" | "vendido" | "removido";
    price?: number;
    imageUrl?: string;
    ownerName: string;
    ownerId: number;
    type: 'offer' | 'trade'
}