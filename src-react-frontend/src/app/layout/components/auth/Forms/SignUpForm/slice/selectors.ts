import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.signUpForm || initialState;

export const selectSignUpForm = createSelector([selectSlice], state => state);
