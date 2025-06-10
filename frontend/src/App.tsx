import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import { PrivateRoute } from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import DomainList from './pages/DomainList';
import DomainOverview from './pages/DomainOverview';
import Forum from './pages/Forum';
import Blogs from './pages/Blogs';
import Roles from './pages/Roles';
import RoleDetail from './pages/RoleDetail';
import FrontendRoadmap from './pages/FrontendRoadmap';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <PrivateRoute>
                  <Assessment />
                </PrivateRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <PrivateRoute>
                  <Roadmap />
                </PrivateRoute>
              }
            />
            <Route
              path="/frontend-roadmap"
              element={
                <PrivateRoute>
                  <FrontendRoadmap />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/domains"
              element={
                <PrivateRoute>
                  <DomainList />
                </PrivateRoute>
              }
            />
            <Route
              path="/domains/:domainId"
              element={
                <PrivateRoute>
                  <DomainOverview />
                </PrivateRoute>
              }
            />
            <Route
              path="/forum"
              element={
                <PrivateRoute>
                  <Forum />
                </PrivateRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <PrivateRoute>
                  <Blogs />
                </PrivateRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <PrivateRoute>
                  <Roles />
                </PrivateRoute>
              }
            />
            <Route
              path="/roles/:roleId"
              element={
                <PrivateRoute>
                  <RoleDetail />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </Provider>
  );
}

export default App; 