import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Saga } from './saga';
import { ExceptionState } from './types';

export const initialState: ExceptionState = {
  hasException: false,
  isServerUnreachable: false,
  isStatus500: false,
  isUnknown: false,
};

const slice = createSlice({
  name: 'exception',
  initialState,
  reducers: {
    handleException(state, action: PayloadAction<any>) {},
    resetException(state) {
      return initialState;
    },
    setServerUnreachable(state) {
      state.hasException = true;
      state.isServerUnreachable = true;
    },
  },
});

export const { actions } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: Saga });
  return { actions: slice.actions };
};
