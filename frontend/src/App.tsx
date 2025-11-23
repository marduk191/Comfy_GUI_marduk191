import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import MainGUI from './pages/MainGUI'
import WorkflowEditor from './pages/WorkflowEditor'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainGUI />} />
          <Route path="/workflow" element={<WorkflowEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
