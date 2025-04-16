import { createSlice } from "@reduxjs/toolkit"

const initialTeam = {}

export const teamSlice = createSlice({
    name: 'team',
    initialState: initialTeam,
    reducers: {
        setTeam: (state, action) => {
            return action.payload;
        },
        resetTeam: () => initialTeam
    }
})

export const {
    setTeam,
    resetTeam
} = teamSlice.actions

export default teamSlice.reducer
