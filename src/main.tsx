import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import BasePage from './components/BasePage'

import Nutrition from "./pages/Nutrition"
import Workouts from "./pages/Workouts"
import PostWorkout from "./pages/PostWorkout"
import Settings from './pages/Settings'
import DashBoard from './pages/DashBoard'
const router = createBrowserRouter([
  {
    path: '/',
    element: <BasePage />,   // ← wraps everything
    children: [
      { index: true, element: <DashBoard /> },
      { path: '/nutition', element: <Nutrition /> },
      { path: '/workout', element: <Workouts /> },
      { path: '/post_workout', element: <PostWorkout /> },
      { path: '/settings', element: <Settings /> }
    ]
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)