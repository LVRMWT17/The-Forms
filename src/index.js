import './light.css';
import './dark.css';
import './App.css';
import ThemeToggle from './comp/ThemeToggle';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './translation';
import i18n from './translation';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Ap from './Ap';
import Apa from './Apa';
import Login from './comp/login';
import ProfilePage from './comp/profile';
import Register from './comp/register';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './comp/ThemeContext';
import { useTheme } from './comp/ThemeContext';
import UserMenu from './comp/forms';
import Creation from './comp/create-form'
import FormDetails from './comp/FormDetails'
import EditForm from './comp/EditForm'
import Answers from './comp/answer'
import Responses from './comp/Responses';
const root = ReactDOM.createRoot(document.getElementById('root'));

const MainComponent = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { theme } = useTheme();
    const [id, setUserId] = useState(null);
    const handleLogin = (user) => {
        console.log('Logged in user:', user);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
        setUserId(user.id);
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin);
    };
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        const userId = localStorage.getItem('userId');
        setIsAuthenticated(authStatus);
        setIsAdmin(adminStatus);
        setUserId(userId);
        document.documentElement.className = theme;
    }, [theme]);
    return (
            <Router>
                <ThemeToggle />
                <Routes>
                    <Route path="*" element={<App />} />
                    <Route path="/comp/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/comp/login" element={<Login setIsAuthenticated={setIsAuthenticated} handleLogin={handleLogin} />} />
                    <Route path="/Ap/:id/*" element={isAuthenticated && isAdmin ? <Ap /> : null} />
                    <Route path="/Apa/:id/*" element={isAuthenticated || !isAdmin ? <Apa /> : <Navigate to="/comp/login" />} />
                    <Route path="/comp/profile/:id" element={isAuthenticated ? <ProfilePage /> : null} />
                    <Route path="/comp/forms" element={<UserMenu />} />
                    <Route path="/create-form" element={<Creation />} />
                    <Route path="/FormDetails/:id" element={<FormDetails />} />
                    <Route path="/EditForm/:id" element={<EditForm /> }/>
                    <Route path="/answer/:id" element={<Answers /> }/>
                    <Route path="/responses" element={<Responses /> }/>
                </Routes>
            </Router>
    );
};

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
        <ThemeProvider>
            <MainComponent />
        </ThemeProvider>
        </I18nextProvider>
    </React.StrictMode>
);

reportWebVitals();

