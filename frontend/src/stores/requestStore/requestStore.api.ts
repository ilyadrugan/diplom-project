import HttpClient from "../../utils/http-client";
import urls from "../../utils/urls";
import { ChangeRequestStatusModel } from "./models";

export const getRequestsApi = async () => {
    console.log(`${urls.requests()}`);
    return await HttpClient.get(`${urls.requests()}`);
};

export const getRequestByIdApi = async (id: number) => {
    console.log(`${urls.requests()}?id=${id}`);
    return await HttpClient.get(`${urls.requests()}?id=${id}`);
};

export const changeStatusRequestApi = async (model: ChangeRequestStatusModel) => {
    console.log(`${urls.requests()}`, model);
    return await HttpClient.patch(`${urls.requests()}/`, model);
};