import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutineList from './components/RoutineList';
import CreateRoutine from './components/CreateRoutine';
import RoutineDetail from './components/RoutineDetail';
import EditRoutine from './components/EditRoutine';

function App() {
    return (
        <Router>
            <div className="App bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/" element={<RoutineList />} />
                    <Route path="/routine/create" element={<CreateRoutine />} />
                    <Route path="/routine/:id" element={<RoutineDetail />} />
                    <Route path="/routine/:id/edit" element={<EditRoutine />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
