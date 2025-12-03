import { api } from "./api";
import type { Listing } from "../types/listing";

export async function fetchListings(): Promise<Listing[]> {
    const res = await api.get<Listing[]>('/listings');
    return res.data;
}

export async function createListing(listing: Partial<Listing>): Promise<Listing> {
    const res = await api.post<Listing>('/listings', listing);
    return res.data;
}

export async function getListingById(id: string): Promise<Listing> {
    const res = await api.get<Listing>(`/listings/${id}`);
    return res.data;
}

