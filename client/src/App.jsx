import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';  // ADD THIS IMPORT
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from "./pages/Projects";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Clients from "./pages/Clients";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {/* ADD NAVBAR HERE - Show only when authenticated */}
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/projects/:id"
          element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/:projectId/expenses"
          element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/:projectId/income"
          element={isAuthenticated ? <Income /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isAuthenticated ? <Projects /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={isAuthenticated ? <Clients /> : <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
