export interface IUser {
    username: string;
    password: string;
    token: string;
    displayName: string;
}

export interface LoginAndLogoutPayload {
    token: string;
    username: string;
    displayName: string;
    id: string;
}

export interface SendMessagePayload {
    displayName: string;
    text: string;
}
