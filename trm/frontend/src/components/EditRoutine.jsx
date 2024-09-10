// src/components/EditRoutine.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useApi from '../hooks/useApi';
import RoutineForm from './RoutineForm/RoutineForm';

const EditRoutine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, put, loading, error } = useApi();
    const [routine, setRoutine] = useState(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const data = await get(`/api/routines/${id}/`);
                setRoutine(data);
            } catch (error) {
                console.error('Error fetching routine:', error);
                // Handle error (e.g., show an error message to the user)
            }
        };
        fetchRoutine();
    }, [id, get]);

    const handleSubmit = async (updatedRoutine) => {
        try {
            await put(`/api/routines/${id}/update/`, updatedRoutine);
            navigate(`/routine/${id}`);
        } catch (error) {
            console.error('Error updating routine:', error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!routine) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                <ArrowLeft className="mr-2" size={20} />
                Back to Routine List
            </Link>
            <RoutineForm initialRoutine={routine} onSubmit={handleSubmit} submitButtonText="Update Routine" />
        </div>
    );
};

export default EditRoutine;
