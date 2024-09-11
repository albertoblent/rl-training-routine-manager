// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutineList from './components/RoutineList';
import CreateRoutine from './components/CreateRoutine';
import RoutineDetail from './components/RoutineDetail';
import EditRoutine from './components/EditRoutine';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <div className="App bg-gray-100 min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<RoutineList />} />
                        <Route path="/routine/create" element={<CreateRoutine />} />
                        <Route path="/routine/:id" element={<RoutineDetail />} />
                        <Route path="/routine/:id/edit" element={<EditRoutine />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
