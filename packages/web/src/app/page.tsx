'use client';
import { StrictMode, useEffect, useState } from 'react';
import { Workspace } from 'types';

export default function Home() {
  const [data, setData] = useState<Workspace[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/workspaces')
      .then((response) => response.json())
      .then(({ data }) => setData(data));
  }, []);

  return (
    <StrictMode>
      <main>
        <h1>Building a fullstack TypeScript project with Turborepo</h1>
        <h2>Workspaces</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </StrictMode>
  );
}
