import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./Pages/HomePage/Home"
import Dashboard from './Pages/Dashboard/Dashboard'
import Navbar from './Navbar'
import './App.css'
import Footer from './Footer'
import MyGoal from './Pages/MyGoal/MyGoal'
import OneGoal from './Pages/OneGoal/OneGoal'
import GoalForm from './Pages/GoalForm/GoalForm'
import GoalEdit from './Pages/GoalEdit/GoalEdit'
import DailyTask from './Pages/DailyTask/DailyTask'
import SignUpLogin from './Pages/SignUpLogin/SignUpLogin'


function App() {

  return (
    <Router>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path = "/goals" element={<MyGoal/>}/>
          <Route path = "/one-goal" element={<OneGoal/>}/>
          <Route path = "/goal-form" element={<GoalForm/>}/>
          <Route path = "/goal-edit/:goalId" element={<GoalEdit/>}/>
          <Route path = "/tasks" element={<DailyTask/>}/>
          <Route path = "/singUpLogin" element={<SignUpLogin/>}/>
        </Routes>
      </main>
      <Footer/>
    </Router>
  )
}

export default App