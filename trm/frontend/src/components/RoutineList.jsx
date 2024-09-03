// src/components/RoutineList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RoutineList = () => {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const response = await axios.get('/api/routines/');
            setRoutines(response.data);
        } catch (error) {
            console.error('Error fetching routines:', error);
        }
    };

    const exportRoutine = async (routine) => {
        try {
            const response = await axios.get(`/api/routines/${routine.id}/export/`);
            const exportData = response.data;

            // Format the data for RL Training Timer
            const formattedData = {
                Duration: exportData.duration,
                Entries: exportData.entries.map((entry) => ({
                    Duration: entry.duration,
                    Name: entry.name,
                    Notes: entry.notes || '',
                    TimeMode: 0,
                    TrainingPackCode: entry.training_pack_code || '',
                    Type: entry.entry_type,
                    Variance: {
                        AllowMirror: '',
                        EnableTraining: '',
                        LimitBoost: '',
                        PlayerVelocity: '',
                        Shuffle: '',
                        UseDefaultSettings: true,
                        VarCarLoc: '',
                        VarCarRot: '',
                        VarLoc: '',
                        VarLocZ: '',
                        VarRot: '',
                        VarSpeed: '',
                        VarSpin: '',
                    },
                    WorkshopMapPath:
                        entry.entry_type === 3 ? `${entry.workshop_map_id}\\${entry.workshop_map_file}` : '',
                })),
                Id: exportData.id,
                Name: exportData.name,
                ReadOnly: false,
            };

            const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${routine.name.replace(/\s+/g, '_')}_routine.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting routine:', error);
            alert('Error exporting routine. Please try again.');
        }
    };

    const deleteRoutine = async (id) => {
        if (window.confirm('Are you sure you want to delete this routine?')) {
            try {
                await axios.delete(`/api/routines/${id}/delete/`);
                alert('Routine deleted successfully');
                fetchRoutines(); // Refresh the list
            } catch (error) {
                console.error('Error deleting routine:', error);
                alert('Error deleting routine. Please try again.');
            }
        }
    };

    return (
        <div>
            <h1>Training Routines</h1>
            <Link to="/create">Create New Routine</Link>
            <ul>
                {routines.map((routine) => (
                    <li key={routine.id}>
                        <Link to={`/routine/${routine.id}`}>{routine.name}</Link> -
                        {Math.round(routine.duration / 60000)} minutes
                        <button onClick={() => exportRoutine(routine)}>Export</button>
                        <button onClick={() => deleteRoutine(routine.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoutineList;
