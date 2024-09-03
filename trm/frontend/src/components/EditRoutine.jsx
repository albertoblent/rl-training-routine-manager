// src/components/EditRoutine.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, PlusCircle, Trash2 } from 'lucide-react';

const EditRoutine = () => {
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
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const response = await axios.get(`/api/routines/${id}/`);
                setRoutine(response.data);
            } catch (error) {
                console.error('Error fetching routine:', error);
            }
        };
        fetchRoutine();
    }, [id]);

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const handleEntryChange = (e) => {
        const value = e.target.name === 'duration' ? parseInt(e.target.value) * 60000 : e.target.value;
        setNewEntry({ ...newEntry, [e.target.name]: value });
    };

    const addEntry = () => {
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
    };

    const removeEntry = (index) => {
        const updatedEntries = routine.entries.filter((_, i) => i !== index);
        setRoutine({ ...routine, entries: updatedEntries });
    };

    const updateRoutine = async () => {
        try {
            await axios.put(`/api/routines/${id}/update/`, routine);
            alert('Routine updated successfully!');
            navigate(`/routine/${id}`);
        } catch (error) {
            console.error('Error updating routine:', error);
            alert('Error updating routine. Please try again.');
        }
    };

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
                        value={Math.round(newEntry.duration / 60000)}
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
                        <option value="1">Freeplay</option>
                        <option value="2">Custom Training Pack</option>
                        <option value="3">Workshop Map</option>
                    </select>
                    {newEntry.entry_type === '2' && (
                        <input
                            type="text"
                            name="training_pack_code"
                            value={newEntry.training_pack_code}
                            onChange={handleEntryChange}
                            placeholder="Training Pack Code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    {newEntry.entry_type === '3' && (
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
        </div>
    );
};

export default EditRoutine;
