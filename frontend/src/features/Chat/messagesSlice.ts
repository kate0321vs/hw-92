import {IMessage} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {addMessage, fetchMessages} from "./messagesThunk.ts";
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

        builder.addCase(addMessage.pending, (state) => {
            state.addLoading = true;
        });
        builder.addCase(addMessage.fulfilled, (state) => {
            state.addLoading = false;
        });
        builder.addCase(addMessage.rejected, (state) => {
            state.addLoading = false;
        });
    }
});

export const messagesReducer = messagesSlice.reducer;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesLoading = (state: RootState) => state.messages.loading;
