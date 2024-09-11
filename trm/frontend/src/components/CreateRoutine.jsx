import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import useApi from '../hooks/useApi';
import RoutineForm from './RoutineForm/RoutineForm';
import ErrorBoundary from './common/ErrorBoundary';
import Loading from './common/Loading';

const CreateRoutine = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { post, loading, error } = useApi();
    const [createError, setCreateError] = useState(null);

    const clonedRoutine = location.state?.clonedRoutine;
    const initialRoutine = clonedRoutine
        ? {
              ...clonedRoutine,
              entries: Array.isArray(clonedRoutine.entries) ? clonedRoutine.entries : [],
          }
        : { name: '', duration: 0, entries: [] };

    const handleSubmit = async (routine) => {
        try {
            const response = await post('/api/routines/create/', routine);
            navigate(`/routine/${response.id}`);
        } catch (error) {
            console.error('Error creating routine:', error);
            setCreateError('Failed to create routine. Please try again.');
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-8">
                {(error || createError) && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center mb-4"
                        role="alert"
                    >
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <span>
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error || createError}</span>
                        </span>
                    </div>
                )}

                <RoutineForm
                    initialRoutine={initialRoutine}
                    onSubmit={handleSubmit}
                    submitButtonText="Create Routine"
                />
            </div>
        </ErrorBoundary>
    );
};

export default CreateRoutine;
