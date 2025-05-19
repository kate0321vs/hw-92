export interface IUser {
    username: string;
    password: string;
    token: string;
    displayName: string;
}

export interface LoginAndLogoutPayload {
    token: string;
    username: string;
}

export interface SendMessagePayload {
    username: string;
    text: string;
}
