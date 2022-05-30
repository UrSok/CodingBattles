import RecordGuard from './RecordGuard';

type GuardProps = {
  Record: typeof RecordGuard;
};

export const Guard: GuardProps = {
  Record: RecordGuard,
};
