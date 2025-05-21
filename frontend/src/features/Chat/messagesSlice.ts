import {IMessage} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {fetchMessages} from "./messagesThunk.ts";
import {RootState} from "../../app/store.ts";

interface MessagesState {
    messages: IMessage[],
    loading: boolean,
    addLoading: boolean,
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    addLoading: false,
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchMessages.fulfilled, (state, {payload: messages}) => {
            state.loading = false;
            state.messages = messages
        });
        builder.addCase(fetchMessages.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const messagesReducer = messagesSlice.reducer;

export const selectMessages = (state: RootState) => state.messages.messages;
