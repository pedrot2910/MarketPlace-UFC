export type Listing = {
    id: string;
    title: string;
    description: string;
    price?: number;
    imageUrl?: string;
    owner: string;
    type: 'offer' | 'trade'
}