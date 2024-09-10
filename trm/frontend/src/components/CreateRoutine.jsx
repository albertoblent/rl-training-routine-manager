// src/components/CreateRoutine.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useApi from '../hooks/useApi';
import RoutineForm from './RoutineForm/RoutineForm';

const CreateRoutine = () => {
    const navigate = useNavigate();
    const { post, loading, error } = useApi();

    const handleSubmit = async (routine) => {
        try {
            const response = await post('/api/routines/create/', routine);
            navigate(`/routine/${response.id}`);
        } catch (error) {
            console.error('Error creating routine:', error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                <ArrowLeft className="mr-2" size={20} />
                Back to Routine List
            </Link>
            <RoutineForm
                initialRoutine={{ name: '', duration: 0, entries: [] }}
                onSubmit={handleSubmit}
                submitButtonText="Create Routine"
            />
        </div>
    );
};

export default CreateRoutine;
