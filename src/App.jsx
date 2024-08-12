import { Route, Routes } from "react-router-dom"
import LoginPage from "./Pages/LoginPage"
import HomePage from "./Pages/HomePage"
import RegisterPage from "./Pages/RegisterPage"
import Dashboard from "./Pages/Dashboard"
import Protected from "./common/Protected"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Protected element={<Dashboard />} />} />
    </Routes>
    </>
  )
}

export default App
