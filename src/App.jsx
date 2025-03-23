import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import { HOME, LOGIN, SIGNUP } from './utils/routes'


function App() {

  const router = createBrowserRouter([
    {path: LOGIN, element: <Login />},
    {path: SIGNUP, element: <SignUp />},
    {path: HOME, element: <Home />}

  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
