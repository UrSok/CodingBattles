import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.layout || initialState;

export const selectLayout = createSelector([selectSlice], state => state);
