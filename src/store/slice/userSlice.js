import { createSlice } from "@reduxjs/toolkit"

const initialUser = {}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        resetUser: () => initialUser
    }
})

export const {
    setUser,
    resetUser
} = userSlice.actions

export default userSlice.reducer

