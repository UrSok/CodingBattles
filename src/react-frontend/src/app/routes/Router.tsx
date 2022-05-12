import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PATH_CHALLENGES, PATH_GAMES, PATH_IDE, PATH_PROFILES } from './paths';

import ChallengePages from 'app/pages/Challenges';
import ErrorResult from 'app/components/ErrorResult';

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
        <Route index element={<ChallengePages.Index />} />
        <Route path=":id" element={<ChallengePages.Details />} />
        <Route path={PATH_CHALLENGES.save}>
          <Route index element={<ChallengePages.Save />} />
          <Route path=":id" element={<ChallengePages.Save />} />
        </Route>
      </Route>
      <Route path={PATH_GAMES.root}>
        <Route index element={<p>games</p>} />
      </Route>
      <Route path={PATH_IDE.root}>
        <Route index element={<p>ide</p>} />
      </Route>
      <Route
        path="*"
        element={
          <ErrorResult
            status="404"
            title="Page not found"
            subTitle="Looks like todays not your day : ("
          />
        }
      />
    </Routes>
  );
}
