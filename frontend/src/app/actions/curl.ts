"use server";

import * as curlconverter from "curlconverter";

export async function convertCurl(curl: string, mode: "fetch" | "axios") {
    if (!curl.trim()) return "";
    try {
        if (mode === "fetch") {
            return curlconverter.toBrowser(curl);
        } else {
            return curlconverter.toNodeAxios(curl);
        }
    } catch (err) {
        throw new Error("Failed to parse cURL command.");
    }
}
