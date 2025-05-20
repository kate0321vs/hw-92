export interface RegisterMutation {
    username: string;
    password: string;
    displayName: string;
}

export interface IUser {
    _id: string;
    username: string;
    password: string;
    displayName: string;
    token: string;
}

export interface RegisterResponse {
    user: IUser;
    message: string;
}

export interface LoginMutation {
    username: string;
    password: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError {
    error: string;
}

export interface ChatMessage {
    username: string;
    text: string;
}

export interface IncomingChatMessages {
    type: 'NEW_MESSAGE';
    payload: ChatMessage;
}

export interface IncomingUserList {
    type: 'USERS_LIST';
    payload: string[];
}

export type IncomingMessage = IncomingChatMessages | IncomingUserList;

export interface IMessage {
    id: string;
    displayName: string;
    text: string;
}

export interface IMessageMutation {
    displayName: string;
    text: string;
}