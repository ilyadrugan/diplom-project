import { PhotoModel } from "../photoStore/models";

export type RequestModel = {
    id: number;
    type_id: string;
    user_login: number;
    comment: string;
    status: number;
    time_create: string;
    type: {
        id: number;
        type_name: string;
    }
    photos: PhotoModel[]
}

export type ChangeRequestStatusModel = {
    id: number;
    status: number;
}