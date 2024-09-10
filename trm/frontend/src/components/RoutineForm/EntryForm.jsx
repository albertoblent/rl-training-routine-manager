// src/components/RoutineForm/EntryForm.jsx
import React, { useState } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { validateTrainingPackCode } from './utils';

const EntryForm = ({ addEntry, showModal }) => {
    const [newEntry, setNewEntry] = useState({
        name: '',
        duration: 60000,
        entry_type: 1,
        training_pack_code: '',
        workshop_map_id: '',
        workshop_map_file: '',
        notes: '',
    });
    const [trainingPackError, setTrainingPackError] = useState('');

    const handleEntryChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'duration') {
            const minutes = Math.max(1, parseInt(value));
            processedValue = minutes * 60000;
        } else if (name === 'entry_type') {
            processedValue = parseInt(value);
        } else if (name === 'training_pack_code') {
            processedValue = value.toUpperCase();
            setTrainingPackError(validateTrainingPackCode(processedValue));
        }

        setNewEntry({ ...newEntry, [name]: processedValue });
    };

    const handleAddEntry = () => {
        if (!newEntry.name.trim()) {
            showModal('Invalid Entry', 'Entry name is required.');
            return;
        }
        if (newEntry.entry_type === 2 && trainingPackError) {
            showModal('Invalid Training Pack Code', 'Please correct the training pack code before adding the entry.');
            return;
        }
        addEntry(newEntry);
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

    return (
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
                    value={Math.max(1, Math.round(newEntry.duration / 60000))}
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
                    type="button"
                    onClick={handleAddEntry}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                    <PlusCircle className="mr-2" size={20} />
                    Add Entry
                </button>
            </div>
        </div>
    );
};

export default EntryForm;
