// src/components/RoutineDetail.jsx
import React, { useState, useEffect } from 'react';
import { Download, Trash2, Edit2, ArrowLeft, Clock, Package, Map, Copy } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import Modal from './Modal';

// Custom hook for fetching routine
const useFetchRoutine = (id) => {
    const { get, loading, error } = useApi();
    const [routine, setRoutine] = useState(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            if (id === 'create') return;
            try {
                const data = await get(`/api/routines/${id}/`);
                setRoutine(data);
            } catch (error) {
                // Error is handled by useApi hook
            }
        };

        fetchRoutine();
    }, [id, get]);

    return { routine, loading, error };
};

const RoutineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, del } = useApi();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const { routine, loading, error } = useFetchRoutine(id);

    const showModal = (title, message, isConfirmation = false) => {
        setModalContent({ title, message, isConfirmation });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        if (modalContent.title === 'Success' && modalContent.message === 'Routine deleted successfully') {
            navigate('/');
        }
    };

    const exportRoutine = async () => {
        if (!routine) return;

        try {
            const exportData = await get(`/api/routines/${id}/export/`);

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

    const cloneRoutine = () => {
        if (!routine) return;

        const clonedRoutine = {
            ...routine,
            name: `Copy of ${routine.name}`,
            id: null,
            entries: routine.entries.map((entry) => ({
                ...entry,
                id: null,
            })),
        };
        navigate('/routine/create', { state: { clonedRoutine } });
    };

    const deleteRoutine = () => {
        showModal('Confirm Deletion', 'Are you sure you want to delete this routine?', true);
    };

    const confirmDelete = async () => {
        try {
            await del(`/api/routines/${id}/delete/`);
            showModal('Success', 'Routine deleted successfully');
        } catch (error) {
            showModal('Error', 'Failed to delete routine. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!routine && id !== 'create') {
        return <div className="text-red-500">Routine not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                <ArrowLeft className="mr-2" size={20} />
                Back to Routine List
            </Link>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">{routine.name}</h1>
                <p className="text-gray-600 mb-4 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Total Duration: {Math.round(routine.duration / 60000)} minutes
                </p>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={exportRoutine}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <Download className="mr-2" size={20} />
                        Export
                    </button>
                    <button
                        onClick={deleteRoutine}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="mr-2" size={20} />
                        Delete
                    </button>
                    <Link
                        to={`/routine/${id}/edit`}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        <Edit2 className="mr-2" size={20} />
                        Edit
                    </Link>
                    <button
                        onClick={cloneRoutine}
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    >
                        <Copy className="mr-2" size={20} />
                        Clone
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Entries</h2>
                <ul className="space-y-4">
                    {routine.entries.map((entry, index) => (
                        <li
                            key={index}
                            className="flex items-start border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                        >
                            <span className="mr-4 font-semibold text-lg text-gray-500">{index + 1}.</span>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium">{entry.name}</h3>
                                        <p className="text-gray-600 flex items-center mt-1">
                                            <Clock className="mr-2" size={16} />
                                            {Math.round(entry.duration / 60000)} minutes
                                        </p>
                                    </div>
                                    {entry.entry_type === 2 && (
                                        <div className="flex items-center text-blue-500">
                                            <Package className="mr-2" size={16} />
                                            Pack: {entry.training_pack_code}
                                        </div>
                                    )}
                                    {entry.entry_type === 3 && (
                                        <div className="flex items-center text-green-500">
                                            <Map className="mr-2" size={16} />
                                            Map: {entry.workshop_map_id}\{entry.workshop_map_file}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalContent.title}>
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
                        onClick={modalContent.isConfirmation ? confirmDelete : handleModalClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {modalContent.isConfirmation ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default RoutineDetail;
