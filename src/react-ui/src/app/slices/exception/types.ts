/* --- STATE --- */
export interface ExceptionState {
  hasException: boolean;
  isServerUnreachable: boolean;
  isStatus500: boolean;
  isUnknown: boolean;
}
