import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PATH_CHALLENGES, PATH_GAMES, PATH_IDE, PATH_PROFILES } from './paths';

import ChallengePage from 'app/pages/Challenges';

export default function Router() {
  return (
    <Routes>
      <Route index element={<p>welcome</p>} />
      <Route path={PATH_PROFILES.root}>
        <Route index element={<p>profiles</p>} />
        <Route path={PATH_PROFILES.ME.root}>
          <Route index element={<p>my profile</p>} />
          <Route
            path={PATH_PROFILES.ME.settings}
            element={<p>my profile settings</p>}
          />
        </Route>
      </Route>
      <Route path={PATH_CHALLENGES.root}>
        <Route index element={<ChallengePage.Search />} />
        <Route path=":id" element={<p>id</p>} />
        <Route path={PATH_CHALLENGES.save}>
          <Route index element={<ChallengePage.Save />} />
          <Route path=":id" element={<ChallengePage.Save />} />
        </Route>
      </Route>
      <Route path={PATH_GAMES.root}>
        <Route index element={<p>games</p>} />
      </Route>
      <Route path={PATH_IDE.root}>
        <Route index element={<p>ide</p>} />
      </Route>
      <Route path="*" element={<p>404</p>} />
    </Routes>
  );
}
