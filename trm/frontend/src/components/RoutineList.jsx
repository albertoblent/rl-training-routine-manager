// src/components/RoutineList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RoutineList = () => {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await axios.get('/api/routines/');
                setRoutines(response.data);
            } catch (error) {
                console.error('Error fetching routines:', error);
            }
        };

        fetchRoutines();
    }, []);

    return (
        <div>
            <h1>Training Routines</h1>
            <Link to="/create">Create New Routine</Link>
            <ul>
                {routines.map((routine) => (
                    <li key={routine.id}>
                        <Link to={`/routine/${routine.id}`}>{routine.name}</Link> -
                        {Math.round(routine.duration / 60000)} minutes
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoutineList;
