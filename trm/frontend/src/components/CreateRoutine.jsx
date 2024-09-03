import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, PlusCircle, Trash2, AlertCircle, Download } from 'lucide-react';
import Modal from './Modal'; // Make sure to import the Modal component

const CreateRoutine = () => {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState({
        name: '',
        duration: 0,
        entries: [],
    });
    const [newEntry, setNewEntry] = useState({
        name: '',
        duration: 0,
        entry_type: 1,
        training_pack_code: '',
        workshop_map_id: '',
        workshop_map_file: '',
        notes: '',
    });
    const [trainingPackError, setTrainingPackError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [newRoutineId, setNewRoutineId] = useState(null);

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const handleEntryChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'duration') {
            const minutes = parseInt(value);
            if (minutes <= 0) {
                // If the input is zero or negative, set it to 1 minute
                processedValue = 60000; // 1 minute in milliseconds
            } else {
                processedValue = minutes * 60000;
            }
        } else if (name === 'entry_type') {
            processedValue = parseInt(value);
        } else if (name === 'training_pack_code') {
            processedValue = value.toUpperCase();
            validateTrainingPackCode(processedValue);
        }

        setNewEntry({ ...newEntry, [name]: processedValue });
    };

    const validateTrainingPackCode = (code) => {
        const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (code && !regex.test(code)) {
            setTrainingPackError('Invalid format. Use XXXX-XXXX-XXXX-XXXX');
        } else {
            setTrainingPackError('');
        }
    };

    const addEntry = () => {
        if (newEntry.entry_type === 2 && trainingPackError) {
            setModalContent({
                title: 'Invalid Training Pack Code',
                message: 'Please correct the training pack code before adding the entry.',
            });
            setIsModalOpen(true);
            return;
        }
        setRoutine({
            ...routine,
            entries: [...routine.entries, { ...newEntry, order: routine.entries.length }],
        });
        setNewEntry({
            name: '',
            duration: 0,
            entry_type: 1,
            training_pack_code: '',
            workshop_map_id: '',
            workshop_map_file: '',
            notes: '',
        });
        setTrainingPackError('');
    };

    const removeEntry = (index) => {
        const updatedEntries = routine.entries.filter((_, i) => i !== index);
        setRoutine({ ...routine, entries: updatedEntries });
    };

    const saveRoutine = async () => {
        try {
            const response = await axios.post('/api/routines/create/', routine, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Routine saved:', response.data);
            setNewRoutineId(response.data.id); // Assuming the API returns the new routine's ID
            setModalContent({
                title: 'Success',
                message: 'Routine saved successfully!',
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error saving routine:', error.response ? error.response.data : error.message);
            setModalContent({
                title: 'Error',
                message: 'Error saving routine. Please try again.',
            });
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        if (modalContent.title === 'Success' && newRoutineId) {
            navigate(`/routine/${newRoutineId}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
                <ArrowLeft className="mr-2" size={20} />
                Back to Routine List
            </Link>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6">Create Training Routine</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        value={routine.name}
                        onChange={handleRoutineChange}
                        placeholder="Routine Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <p className="text-gray-600 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Total Duration: {Math.round(routine.duration / 60000)} minutes
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Add Entry</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={newEntry.name}
                        onChange={handleEntryChange}
                        placeholder="Entry Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="duration"
                        value={newEntry.duration ? Math.max(1, Math.round(newEntry.duration / 60000)) : 1}
                        onChange={handleEntryChange}
                        placeholder="Duration (minutes)"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="entry_type"
                        value={newEntry.entry_type}
                        onChange={handleEntryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={1}>Freeplay</option>
                        <option value={2}>Custom Training Pack</option>
                        <option value={3}>Workshop Map</option>
                    </select>
                    {newEntry.entry_type === 2 && (
                        <div>
                            <input
                                type="text"
                                name="training_pack_code"
                                value={newEntry.training_pack_code}
                                onChange={handleEntryChange}
                                placeholder="Training Pack Code (e.g., XXXX-XXXX-XXXX-XXXX)"
                                className={`w-full px-3 py-2 border ${
                                    trainingPackError ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {trainingPackError && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <AlertCircle className="mr-1" size={16} />
                                    {trainingPackError}
                                </p>
                            )}
                        </div>
                    )}
                    {newEntry.entry_type === 3 && (
                        <>
                            <input
                                type="text"
                                name="workshop_map_id"
                                value={newEntry.workshop_map_id}
                                onChange={handleEntryChange}
                                placeholder="Workshop Map ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="workshop_map_file"
                                value={newEntry.workshop_map_file}
                                onChange={handleEntryChange}
                                placeholder="Workshop Map File"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    <textarea
                        name="notes"
                        value={newEntry.notes}
                        onChange={handleEntryChange}
                        placeholder="Notes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    />
                    <button
                        onClick={addEntry}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                        <PlusCircle className="mr-2" size={20} />
                        Add Entry
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Entries</h2>
                <ul className="space-y-4">
                    {routine.entries.map((entry, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                        >
                            <div>
                                <h3 className="text-lg font-medium">{entry.name}</h3>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Clock className="mr-2" size={16} />
                                    {Math.round(entry.duration / 60000)} minutes
                                </p>
                                {entry.entry_type === 2 && (
                                    <p className="text-blue-500 mt-1">Pack: {entry.training_pack_code}</p>
                                )}
                                {entry.entry_type === 3 && (
                                    <p className="text-green-500 mt-1">
                                        Map: {entry.workshop_map_id}\{entry.workshop_map_file}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeEntry(index)}
                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={saveRoutine}
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Save Routine
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalContent.title}>
                <p>{modalContent.message}</p>
                <button
                    onClick={handleModalClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    OK
                </button>
            </Modal>
        </div>
    );
};

export default CreateRoutine;
