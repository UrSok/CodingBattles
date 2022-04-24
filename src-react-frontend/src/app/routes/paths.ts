function combinePath(root: string, sublink: string): string {
  return `${root}${sublink}`;
}

const ROOTS_MYPROFILE: string = '/myprofile';
const ROOTS_PROFILES: string = '/profiles';
const ROOTS_CHALLENGES: string = '/challenges';
const ROOTS_GAMES: string = '/games';
const ROOTS_IDE: string = '/ide';

export const PATH_PAGE = {
  maintenance: '/maintenance',
  page404: '/404',
  page401: '/401',
  page500: '/500',
};

export const PATH_MYPROFILE = {
  root: ROOTS_MYPROFILE,
  edit: combinePath(ROOTS_MYPROFILE, '/edit'),
};

export const PATH_PROFILES = {
  root: ROOTS_PROFILES,
};

export const PATH_CHALLENGES = {
  root: ROOTS_CHALLENGES,
};

export const PATH_GAMES = {
  root: ROOTS_GAMES,
};

export const PATH_IDE = {
  root: ROOTS_IDE,
};
