import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  PATH_CHALLENGES,
  PATH_GAMES,
  PATH_IDE,
  PATH_MYPROFILE,
  PATH_PROFILES,
} from './paths';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<p>welcome</p>} />
      <Route path={PATH_MYPROFILE.root} element={<p>my profile</p>} />
      <Route path={PATH_PROFILES.root} element={<p>profiles</p>} />
      <Route path={PATH_CHALLENGES.root} element={<p>challenges</p>} />
      <Route path={PATH_GAMES.root} element={<p>games</p>} />
      <Route path={PATH_IDE.root} element={<p>ide</p>} />
    </Routes>
  );
}
