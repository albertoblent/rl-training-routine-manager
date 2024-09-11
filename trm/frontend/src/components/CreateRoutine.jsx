import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import useApi from '../hooks/useApi';
import RoutineForm from './RoutineForm/RoutineForm';
import ErrorBoundary from './common/ErrorBoundary';
import Loading from './common/Loading';

const CreateRoutine = () => {
    const navigate = useNavigate();
    const { post, loading, error } = useApi();
    const [createError, setCreateError] = useState(null);

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
                <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Routine List
                </Link>

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
                    initialRoutine={{ name: '', duration: 0, entries: [] }}
                    onSubmit={handleSubmit}
                    submitButtonText="Create Routine"
                />
            </div>
        </ErrorBoundary>
    );
};

export default CreateRoutine;
