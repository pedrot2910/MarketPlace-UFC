import axios from "axios";

export interface NominatimAddress {
    state?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
    country?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string[]> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    const response = await axios.get(url, {
        headers: {
            "User-Agent": "ReUse MarketPlace (messiastrajano@alu.ufc.br)"
        }
    });

    const addr = response.data.address as NominatimAddress | undefined;

    const completeAddr: string[] = [
        addr?.neighbourhood || addr?.suburb || "",
        ", " + addr?.city || addr?.town || addr?.village || "",
        " - " + (addr?.state || ""),
        ", " + addr?.road || "",
        ", " + addr?.house_number || "",
        ", " + addr?.postcode || "",
    ].filter(item => item !== "");

    return completeAddr;
}