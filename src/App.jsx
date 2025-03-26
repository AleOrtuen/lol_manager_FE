import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import Team from './components/Team';
import { COMP_BUILDER, HOME, LOGIN, SIGNUP, TEAM } from './utils/routes'
import CompBuilder from './components/CompBuilder';


function App() {

  const router = createBrowserRouter([
    {path: LOGIN, element: <Login />},
    {path: SIGNUP, element: <SignUp />},
    {path: HOME, element: <Home />},
    {path: TEAM, element: <Team />},
    {path: COMP_BUILDER, element: <CompBuilder />}

  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
