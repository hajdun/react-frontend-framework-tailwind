import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import BasePage from './components/BasePage'

import Dashboard from "./pages/Dashboard"
import Nutrition from "./pages/Nutrition"
import Progress from "./pages/Progress"
import Workouts from "./pages/Workouts"
import Form from "./pages/Form"
const router = createBrowserRouter([
  {
    path: '/',
    element: <BasePage />,   // ← wraps everything
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/nutition', element: <Nutrition /> },
      { path: '/progress', element: <Progress /> },
      { path: '/workout', element: <Workouts /> },
      { path: '/form', element: <Form /> }
    ]
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)