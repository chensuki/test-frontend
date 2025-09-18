import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Timesheets from './pages/Timesheets';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1 className="app-title">工时/项目管理</h1>
        <nav className="nav">
          <Link to="/projects">项目管理</Link>
          <Link to="/timesheets">工时管理</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/timesheets" element={<Timesheets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
