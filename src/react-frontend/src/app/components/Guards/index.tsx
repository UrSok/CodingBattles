import AuthGuard from './AuthGuard';
import RecordGuard from './RecordGuard';

type GuardProps = {
  Record: typeof RecordGuard;
  Auth: typeof AuthGuard;
};

export const Guard: GuardProps = {
  Record: RecordGuard,
  Auth: AuthGuard,
};
