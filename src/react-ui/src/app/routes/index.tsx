import { PageLoading } from '@ant-design/pro-layout';
import { App } from 'app';
import TestComponent from 'app/components/TestComponent';
import Challenges from 'app/pages/Challenges';
import React from 'react';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<TestComponent name="welcome" />} />
      <Route path="/profile" element={<TestComponent name="profile" />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/games" element={<TestComponent name="games" />} />
    </Routes>
  );
}
