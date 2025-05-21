import HttpClient from "../../utils/http-client";
import urls from "../../utils/urls";
import { ChangeUserModel, CreateUserModel, LoginByEmailPasswordModel } from "./models";

export const login = async (model: LoginByEmailPasswordModel) => {
    console.log(model,`${urls.login()}`);
    return await HttpClient.post(`${urls.login()}`, model);
};

export const getUsersApi = async () => {
    console.log(`${urls.users()}`);
    return await HttpClient.get(`${urls.users()}`);
};
export const getUserByIdApi = async (id: number) => {
    console.log(`${urls.users()}?${id}`);
    return await HttpClient.get(`${urls.users()}?id=${id}`);
};
export const createUserApi = async (model: CreateUserModel) => {
    console.log(`${urls.users()}`, model);
    return await HttpClient.post(`${urls.users()}`, model);
};
export const changeUserApi = async (model: ChangeUserModel, id: number) => {
    console.log(`${urls.users()}?id=${id}`, model);
    return await HttpClient.put(`${urls.users()}?id=${id}`, model);
};