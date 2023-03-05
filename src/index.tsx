import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { mappedRoutes } from './routes';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        {mappedRoutes.map((route: any, index: number) => (
          <Route
            path={route.path}
            key={'route-key-' + index}
            element={<route.component />}
          />
        ))}
      </Route>
    </Routes>
  </BrowserRouter>
);
