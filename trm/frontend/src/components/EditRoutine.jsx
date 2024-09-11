import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import useApi from '../hooks/useApi';
import RoutineForm from './RoutineForm/RoutineForm';
import ErrorBoundary from './common/ErrorBoundary';
import Loading from './common/Loading';

const EditRoutine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, put, loading, error } = useApi();
    const [routine, setRoutine] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const data = await get(`/api/routines/${id}/`);
                setRoutine(data);
            } catch (error) {
                console.error('Error fetching routine:', error);
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
            setUpdateError(error.message || 'An error occurred while updating the routine.');
        }
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center"
                role="alert"
            >
                <AlertTriangle className="mr-2 h-5 w-5" />
                <span>
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </span>
            </div>
        );
    }

    if (!routine) return null;

    return (
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Routine List
                </Link>
                {updateError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center mb-4"
                        role="alert"
                    >
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <span>
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{updateError}</span>
                        </span>
                    </div>
                )}
                <RoutineForm initialRoutine={routine} onSubmit={handleSubmit} submitButtonText="Update Routine" />
            </div>
        </ErrorBoundary>
    );
};

export default EditRoutine;
