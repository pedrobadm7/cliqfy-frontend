import { createBrowserRouter } from 'react-router-dom';
import { Login } from '../pages/auth/login';
import NotFound from '../pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
