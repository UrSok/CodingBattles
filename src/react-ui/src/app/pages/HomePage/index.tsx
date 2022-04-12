import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="" />
      </Helmet>
      <span>My HomePage</span>
    </>
  );
}
