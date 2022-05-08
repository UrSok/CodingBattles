import { createSlice } from 'utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { layoutSaga } from './saga';
import { LayoutState } from './types';

export const initialState: LayoutState = {
  showUnkownError: false,
};

const slice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    resetUnkownException(state) {
      state.showUnkownError = initialState.showUnkownError;
    },
    showUnkownException(state) {
      state.showUnkownError = true;
    },
  },
});

export const { actions: layoutActions } = slice;

export const useLayoutSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: layoutSaga });
  return { actions: slice.actions };
};
