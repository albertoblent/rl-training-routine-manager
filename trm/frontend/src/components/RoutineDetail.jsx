// src/components/RoutineDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RoutineDetail = () => {
    const [routine, setRoutine] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchRoutine = useCallback(async () => {
        try {
            const response = await axios.get(`/api/routines/${id}/`);
            setRoutine(response.data);
        } catch (error) {
            console.error('Error fetching routine:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchRoutine();
    }, [fetchRoutine]);

    const exportRoutine = async () => {
        if (!routine) return;

        try {
            const response = await axios.get(`/api/routines/${id}/export/`);
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

    const deleteRoutine = async () => {
        if (window.confirm('Are you sure you want to delete this routine?')) {
            try {
                await axios.delete(`/api/routines/${id}/delete/`);
                alert('Routine deleted successfully');
                navigate('/'); // Redirect to the routine list
            } catch (error) {
                console.error('Error deleting routine:', error);
                alert('Error deleting routine. Please try again.');
            }
        }
    };

    if (!routine) return <div>Loading...</div>;

    return (
        <div>
            <h1>{routine.name}</h1>
            <p>Total Duration: {Math.round(routine.duration / 60000)} minutes</p>
            <button onClick={exportRoutine}>Export</button>
            <button onClick={deleteRoutine}>Delete</button>
            <h2>Entries</h2>
            <ul>
                {routine.entries.map((entry, index) => (
                    <li key={index}>
                        {entry.name} - {Math.round(entry.duration / 60000)} minutes
                        {entry.entry_type === 2 && ` - Pack: ${entry.training_pack_code}`}
                        {entry.entry_type === 3 && ` - Map: ${entry.workshop_map_id}\\${entry.workshop_map_file}`}
                    </li>
                ))}
            </ul>
            <Link to="/">Back to Routine List</Link>
        </div>
    );
};

export default RoutineDetail;
