import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// import your pages here
import Dashboard from './components/Dashboard';
import SignInPage from './pages/SignInPage';
import Layout from './components/Layout';
import Tasks from './components/Tasks';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/signin' element={<Layout children={<SignInPage />} />} />
          <Route path="*" element={<ProtectedRoute><Layout children={<Dashboard children={<Tasks />}/>} /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
