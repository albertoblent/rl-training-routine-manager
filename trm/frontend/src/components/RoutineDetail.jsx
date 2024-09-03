// src/components/RoutineDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RoutineDetail = () => {
    const [routine, setRoutine] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const response = await axios.get(`/api/routines/${id}/`);
                setRoutine(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching routine:', error);
            }
        };

        fetchRoutine();
    }, [id]);

    if (!routine) return <div>Loading...</div>;

    return (
        <div>
            <h1>{routine.name}</h1>
            <p>Total Duration: {Math.round(routine.duration / 60000)} minutes</p>
            <h2>Entries</h2>
            <ul>
                {routine.entries.map((entry, index) => (
                    <li key={index}>
                        {entry.name} - {Math.round(entry.duration / 60000)} minutes
                        {entry.entry_type === 2 && ` - Pack: ${entry.training_pack_code}`}
                        {entry.entry_type === 3 && ` - Map: ${entry.workshop_map_id}\\${entry.workshop_map_file}`}
                        {entry.notes && ` - ${entry.notes}`}
                    </li>
                ))}
            </ul>
            <Link to="/">Back to Routine List</Link>
        </div>
    );
};

export default RoutineDetail;
