
export type ListingFilters = {
    lat?: number;
    lng?: number;
    radius?: number;
    search?: string;
    category?: string;
    mode?: 'venda' | 'troca';
}