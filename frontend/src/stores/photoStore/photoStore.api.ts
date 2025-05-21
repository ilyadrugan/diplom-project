import HttpClient from "../../utils/http-client";
import urls from "../../utils/urls";

export const getPhotosApi = async (date: string) => {
    console.log(`${urls.requests()}`);
    return await HttpClient.get(`${urls.photos()}?date=${date}`);
};