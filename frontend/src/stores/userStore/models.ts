export type LoginByEmailPasswordModel = {
    login: string;
    password: string;
};


export type UserInfoModel = {
    id: number;
    token: string;
    login: number;
    email: string;
    user_status: string;
    name: string;
    last_name: string;
    middle_name: string;
}

export type CreateUserModel = {
    email: string;
    user_status: string;
    name: string;
    last_name: string;
    middle_name: string;
    password: string;
}

export type ChangeUserModel = {
    email: string;
    user_status: string;
    name: string;
    last_name: string;
    middle_name: string;
}