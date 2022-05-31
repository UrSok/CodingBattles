import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PATH_CHALLENGES, PATH_LOBBY, PATH_PROFILES } from './paths';

import ChallengePages from 'app/pages/Challenges';
import ErrorResult from 'app/components/ErrorResult';
import LobbiesPage from 'app/pages/Lobbies/pages/Index';
import Lobby from 'app/pages/Lobbies/pages/Lobby';
import Dashboard from 'app/pages/Dashboard';
import ActivateProfile from 'app/components/Auth/ActivateProfile';
import { Guard } from 'app/components/Guards';

export default function Router() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path={PATH_PROFILES.root}>
        <Route index element={<p>profiles</p>} />
        <Route path={PATH_PROFILES.ME.root}>
          <Route
            index
            element={
              <Guard.Auth memberRoleNeeded>
                <p>my profile</p>
              </Guard.Auth>
            }
          />
          <Route
            path={PATH_PROFILES.ME.settings}
            element={
              <Guard.Auth memberRoleNeeded>
                <p>my profile settings</p>
              </Guard.Auth>
            }
          />
          <Route
            path={PATH_PROFILES.ME.activate}
            element={<ActivateProfile />}
          />
        </Route>
      </Route>
      <Route path={PATH_CHALLENGES.root}>
        <Route index element={<ChallengePages.Index />} />
        <Route path=":id" element={<ChallengePages.Details />} />
        <Route path={PATH_CHALLENGES.save}>
          <Route
            index
            element={
              <Guard.Auth memberRoleNeeded>
                <ChallengePages.Save />
              </Guard.Auth>
            }
          />
          <Route
            path=":id"
            element={
              <Guard.Auth memberRoleNeeded>
                <ChallengePages.Save />
              </Guard.Auth>
            }
          />
        </Route>
      </Route>
      <Route path={PATH_LOBBY.root}>
        <Route index element={<LobbiesPage />} />
        <Route
          path=":id"
          element={
            <Guard.Auth>
              <Lobby />
            </Guard.Auth>
          }
        />
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
