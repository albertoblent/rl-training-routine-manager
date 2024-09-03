// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutineList from './components/RoutineList';
import TrainingRoutineManager from './components/TrainingRoutineManager';
import RoutineDetail from './components/RoutineDetail';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RoutineList />} />
                    <Route path="/create" element={<TrainingRoutineManager />} />
                    <Route path="/routine/:id" element={<RoutineDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
