import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import Team from './components/Team';
import CompBuilder from './components/CompBuilder';
import TeamComp from './components/TeamComp';
import { COMP_BUILDER, HOME, LOGIN, SIGNUP, TEAM, TEAM_COMP } from './utils/routes'

function App() {

  const router = createBrowserRouter([
    {path: LOGIN, element: <Login />},
    {path: SIGNUP, element: <SignUp />},
    {path: HOME, element: <Home />},
    {path: TEAM, element: <Team />},
    {path: COMP_BUILDER, element: <CompBuilder />},
    {path: TEAM_COMP, element: <TeamComp />}

  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
