import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ACCOUNT, COMP, COMP_BUILDER, COMP_FORM, HOME, LOGIN, POOL, SIGNUP, TEAM, TEAM_COMP, TEAM_FORM, TEAMS } from './utils/routes'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Home from './components/Home';
import Team from './components/Team';
import CompBuilder from './components/CompBuilder';
import TeamComp from './components/TeamComp';
import Account from './components/Account';
import ChampionPool from './components/ChampionPool';
import TeamForm from './components/TeamForm';
import Teams from './components/Teams';
import CompForm from './components/CompForm';
import Comp from './components/Comp';

function App() {

  const router = createBrowserRouter([
    {path: LOGIN, element: <Login />},
    {path: SIGNUP, element: <SignUp />},
    {path: HOME, element: <Home />},
    {path: TEAM, element: <Team />},
    {path: COMP_BUILDER, element: <CompBuilder />},
    {path: TEAM_COMP, element: <TeamComp />},
    {path: ACCOUNT, element: <Account />},
    {path: POOL, element: <ChampionPool />},
    {path: TEAM_FORM, element: <TeamForm />},
    {path: TEAMS, element: <Teams />},
    {path: COMP_FORM, element: <CompForm />},
    {path: COMP, element: <Comp />}
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
