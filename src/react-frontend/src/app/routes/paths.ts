function combinePath(root: string, sublink: string): string {
  return `${root}${sublink}`;
}

const ROOTS_PROFILES: string = '/profiles';
const ROOTS_PROFILES_ME: string = combinePath(ROOTS_PROFILES, '/me');
const ROOTS_CHALLENGES: string = '/challenges';
const ROOTS_LOBBY: string = '/lobby';
const ROOTS_IDE: string = '/ide';

export const PATH_PAGE = {
  maintenance: '/maintenance',
  page404: '/404',
  page401: '/401',
  page500: '/500',
};

const PATH_PROFILES_ME = {
  root: ROOTS_PROFILES_ME,
  settings: combinePath(ROOTS_PROFILES_ME, '/settings'),
  activate: combinePath(ROOTS_PROFILES_ME, '/:userId/activate/:code'),
};

export const PATH_PROFILES = {
  root: ROOTS_PROFILES,
  ME: PATH_PROFILES_ME,
};

export const PATH_CHALLENGES = {
  root: ROOTS_CHALLENGES,
  save: combinePath(ROOTS_CHALLENGES, '/save'),
  //myChallenges: combinePath(ROOTS_CHALLENGES, '/my'),
};

export const PATH_LOBBY = {
  root: ROOTS_LOBBY,
  voting: combinePath(ROOTS_LOBBY, '/voting'),
  ide: combinePath(ROOTS_LOBBY, '/ide'),
  summary: combinePath(ROOTS_LOBBY, '/summary'),
};

export const PATH_IDE = {
  root: ROOTS_IDE,
};
