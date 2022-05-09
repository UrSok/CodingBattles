import MineGuard from './MineGuard';

type GuardProps = {
  Mine: typeof MineGuard;
}

export const Guard = {
  Mine: MineGuard,
};
