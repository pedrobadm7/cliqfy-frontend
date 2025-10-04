import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard } from '@/pages/dashboard';
import { createBrowserRouter } from 'react-router-dom';
import { Login } from '../pages/auth/login';
import NotFound from '../pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
