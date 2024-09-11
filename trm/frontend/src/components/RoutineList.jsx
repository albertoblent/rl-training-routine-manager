// src/components/RoutineList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Download, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import ErrorBoundary from './common/ErrorBoundary';
import Loading from './common/Loading';

const RoutineList = () => {
    const [routines, setRoutines] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [routineToDelete, setRoutineToDelete] = useState(null);
    const { get, del, loading, error } = useApi();

    const fetchRoutines = useCallback(async () => {
        try {
            const data = await get('/api/routines/');
            setRoutines(data);
        } catch (error) {
            showModal('Error', 'Failed to fetch routines. Please try again.');
        }
    }, [get]);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    const exportRoutine = async (routine) => {
        try {
            const exportData = await get(`/api/routines/${routine.id}/export/`);

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
            showModal('Error', 'Failed to export routine. Please try again.');
        }
    };

    const showDeleteConfirmation = (routine) => {
        setRoutineToDelete(routine);
        showModal('Confirm Deletion', `Are you sure you want to delete the routine "${routine.name}"?`, true);
    };

    const deleteRoutine = async () => {
        if (routineToDelete) {
            try {
                await del(`/api/routines/${routineToDelete.id}/delete/`);
                // Update the local state immediately
                setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineToDelete.id));
                showModal('Success', 'Routine deleted successfully');
            } catch (error) {
                showModal('Error', 'Failed to delete routine. Please try again.');
            }
            setRoutineToDelete(null);
        }
    };

    const showModal = (title, message, isConfirmation = false) => {
        setModalContent({ title, message, isConfirmation });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        if (modalContent.isConfirmation) {
            deleteRoutine();
        } else {
            setIsModalOpen(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

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

    return (
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <Loading />
                ) : error ? (
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
                ) : (
                    <ul className="space-y-4">
                        {routines.map((routine) => (
                            <li
                                key={routine.id}
                                className="bg-gray-50 shadow-sm rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <Link
                                        to={`/routine/${routine.id}`}
                                        className="text-lg font-semibold text-blue-600 hover:underline"
                                    >
                                        {routine.name}
                                    </Link>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {Math.round(routine.duration / 60000)} minutes
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => exportRoutine(routine)}
                                        className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                                        title="Export"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        onClick={() => showDeleteConfirmation(routine)}
                                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <Link
                                        to={`/routine/${routine.id}/edit`}
                                        className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={20} />
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                    <p>{modalContent.message}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        {modalContent.isConfirmation && (
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleModalClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {modalContent.isConfirmation ? 'Confirm' : 'OK'}
                        </button>
                    </div>
                </Modal>
            </div>
        </ErrorBoundary>
    );
};

export default RoutineList;
