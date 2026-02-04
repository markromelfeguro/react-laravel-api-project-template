import type { AxiosResponse } from "axios";
import { notify } from "../utils/notify";

export async function handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
    errorMessage: string,
    returnFullResponse?: false
): Promise<T>;

export async function handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
    errorMessage: string,
    returnFullResponse: true
): Promise<AxiosResponse<T>>;

export async function handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
    errorMessage: string,
    returnFullResponse: boolean = false
): Promise<any> {
    try {
        const response = await request;
        return returnFullResponse ? response : response.data;
    } catch (error: any) {
        const status = error.response?.status;

        const silentStatuses = [401, 422, 503];
        
        if (!silentStatuses.includes(status)) {
            notify.error(errorMessage || "An unexpected error occurred.");
        }
        
        throw error;
    }
}