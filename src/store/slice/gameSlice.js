import { createSlice } from "@reduxjs/toolkit";

const initialGame = {
    game: {},
    drafts: [] 
};

export const gameSlice = createSlice({
    name: "game",
    initialState: initialGame,
    reducers: {
        setGameData: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateGame: (state, action) => {
            state.game = { ...state.game, ...action.payload };
        },
        updateDraft: (state, action) => {
            state.drafts = action.payload; 
        },
        addPickOrBan: (state, action) => {
            const { index, type, data } = action.payload;
            if (!state.drafts[index]) return;

            if (type === "pick") {
                state.drafts[index].picks.push(data);
            } else if (type === "ban") {
                state.drafts[index].bans.push(data);
            }
        },

        resetGame: () => initialGame
    }
});

export const {
    setGameData,
    updateGame,
    updateDraft,
    addPickOrBan,
    resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
