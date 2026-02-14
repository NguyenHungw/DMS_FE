import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: localStorage.getItem('darkMode') === 'true',
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
            localStorage.setItem('darkMode', state.darkMode);
        },
    },
});

export const { toggleDarkMode, setDarkMode } = uiSlice.actions;

export default uiSlice.reducer;
