import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Home from './pages/Home/Home';
import TaskDetail from './pages/TaskDetail/TaskDetail';
import NotFound from './pages/NotFound/NotFound';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/task/:id" element={<TaskDetail />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
        </Router>
    );
}

export default App;
