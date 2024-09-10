// src/components/EditRoutine.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from './Modal';
import useApi from '../hooks/useApi';
import { ArrowLeft, Clock, PlusCircle, Trash2, AlertCircle, Edit, Save, X } from 'lucide-react';

const EditRoutine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, put, loading, error } = useApi();

    const [routine, setRoutine] = useState({
        name: '',
        duration: 0,
        entries: [],
    });
    const [newEntry, setNewEntry] = useState({
        name: '',
        duration: 60000, // Set initial duration to 1 minute
        entry_type: 1,
        training_pack_code: '',
        workshop_map_id: '',
        workshop_map_file: '',
        notes: '',
    });
    const [editingEntry, setEditingEntry] = useState(null);
    const [trainingPackError, setTrainingPackError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const data = await get(`/api/routines/${id}/`);
                setRoutine(data);
            } catch (error) {
                showModal('Error', 'Failed to fetch routine. Please try again.');
            }
        };
        fetchRoutine();
    }, [id, get]);

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const handleEntryChange = (e, isNewEntry = true) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'duration') {
            const minutes = Math.max(1, parseInt(value));
            processedValue = minutes * 60000;
        } else if (name === 'entry_type') {
            processedValue = parseInt(value);
        } else if (name === 'training_pack_code') {
            processedValue = value.toUpperCase();
            validateTrainingPackCode(processedValue);
        }

        if (isNewEntry) {
            setNewEntry({ ...newEntry, [name]: processedValue });
        } else {
            setEditingEntry({ ...editingEntry, [name]: processedValue });
        }
    };

    const validateTrainingPackCode = (code) => {
        const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        setTrainingPackError(code && !regex.test(code) ? 'Invalid format. Use XXXX-XXXX-XXXX-XXXX' : '');
    };

    const addEntry = () => {
        if (newEntry.entry_type === 2 && trainingPackError) {
            showModal('Invalid Training Pack Code', 'Please correct the training pack code before adding the entry.');
            return;
        }
        setRoutine({
            ...routine,
            entries: [...routine.entries, { ...newEntry, order: routine.entries.length }],
        });
        setNewEntry({
            name: '',
            duration: 60000,
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

    const startEditingEntry = (entry, index) => {
        setEditingEntry({ ...entry, index });
        if (entry.entry_type === 2) {
            validateTrainingPackCode(entry.training_pack_code);
        }
    };

    const cancelEditingEntry = () => {
        setEditingEntry(null);
        setTrainingPackError('');
    };

    const saveEditingEntry = () => {
        if (editingEntry.entry_type === 2 && trainingPackError) {
            showModal('Invalid Training Pack Code', 'Please correct the training pack code before saving the entry.');
            return;
        }
        const updatedEntries = [...routine.entries];
        updatedEntries[editingEntry.index] = { ...editingEntry };
        setRoutine({ ...routine, entries: updatedEntries });
        setEditingEntry(null);
        setTrainingPackError('');
    };

    const updateRoutine = async () => {
        try {
            await put(`/api/routines/${id}/update/`, routine);
            showModal('Success', 'Routine updated successfully!');
        } catch (error) {
            showModal('Error', 'Error updating routine. Please try again.');
        }
    };

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        if (modalContent.title === 'Success') {
            navigate(`/routine/${id}`);
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

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6">Edit Training Routine</h1>
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
                            {editingEntry && editingEntry.index === index ? (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingEntry.name}
                                        onChange={(e) => handleEntryChange(e, false)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    />
                                    <input
                                        type="number"
                                        name="duration"
                                        value={
                                            editingEntry.duration
                                                ? Math.max(1, Math.round(editingEntry.duration / 60000))
                                                : 1
                                        }
                                        onChange={(e) => handleEntryChange(e, false)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    />
                                    <select
                                        name="entry_type"
                                        value={editingEntry.entry_type}
                                        onChange={(e) => handleEntryChange(e, false)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    >
                                        <option value={1}>Freeplay</option>
                                        <option value={2}>Custom Training Pack</option>
                                        <option value={3}>Workshop Map</option>
                                    </select>
                                    {editingEntry.entry_type === 2 && (
                                        <div>
                                            <input
                                                type="text"
                                                name="training_pack_code"
                                                value={editingEntry.training_pack_code}
                                                onChange={(e) => handleEntryChange(e, false)}
                                                placeholder="Training Pack Code (e.g., XXXX-XXXX-XXXX-XXXX)"
                                                className={`w-full px-3 py-2 border ${
                                                    trainingPackError ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2`}
                                            />
                                            {trainingPackError && (
                                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="mr-1" size={16} />
                                                    {trainingPackError}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {editingEntry.entry_type === 3 && (
                                        <>
                                            <input
                                                type="text"
                                                name="workshop_map_id"
                                                value={editingEntry.workshop_map_id}
                                                onChange={(e) => handleEntryChange(e, false)}
                                                placeholder="Workshop Map ID"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                            />
                                            <input
                                                type="text"
                                                name="workshop_map_file"
                                                value={editingEntry.workshop_map_file}
                                                onChange={(e) => handleEntryChange(e, false)}
                                                placeholder="Workshop Map File"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                            />
                                        </>
                                    )}
                                    <textarea
                                        name="notes"
                                        value={editingEntry.notes}
                                        onChange={(e) => handleEntryChange(e, false)}
                                        placeholder="Notes"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 mb-2"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={saveEditingEntry}
                                            className="p-2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <Save size={20} />
                                        </button>
                                        <button
                                            onClick={cancelEditingEntry}
                                            className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-lg font-medium">{entry.name}</h3>
                                        <p className="text-gray-600 flex items-center mt-1">
                                            <Clock className="mr-2" size={16} />
                                            {entry.duration ? Math.round(entry.duration / 60000) : 0} minutes
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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEditingEntry(entry, index)}
                                            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            onClick={() => removeEntry(index)}
                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={updateRoutine}
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Update Routine
                </button>
                <Link
                    to="/"
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                    Cancel
                </Link>
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

export default EditRoutine;
