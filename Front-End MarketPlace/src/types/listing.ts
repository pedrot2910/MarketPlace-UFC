export type Listing = {
    id: string;
    title: string;
    description: string;
    price?: number;
    imageUrl?: string;
    ownerName: string;
    ownerId: number;
    type: 'offer' | 'trade'
}