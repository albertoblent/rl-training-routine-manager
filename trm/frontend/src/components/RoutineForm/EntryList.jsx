// src/components/RoutineForm/EntryList.jsx
import React, { useState } from 'react';
import { AlertCircle, Clock, Edit, Trash2, Save, X } from 'lucide-react';
import { validateTrainingPackCode } from './utils';

const EntryList = ({ entries, updateEntry, removeEntry, serverErrors }) => {
    const [editingEntry, setEditingEntry] = useState(null);
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

        setEditingEntry({ ...editingEntry, [name]: processedValue });
    };

    const startEditingEntry = (entry, index) => {
        setEditingEntry({ ...entry, index });
        if (entry.entry_type === 2) {
            setTrainingPackError(validateTrainingPackCode(entry.training_pack_code));
        }
    };

    const cancelEditingEntry = () => {
        setEditingEntry(null);
        setTrainingPackError('');
    };

    const saveEditingEntry = () => {
        if (editingEntry.entry_type === 2 && trainingPackError) {
            // You might want to show a modal here
            return;
        }
        updateEntry(editingEntry, editingEntry.index);
        setEditingEntry(null);
        setTrainingPackError('');
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Entries</h2>
            <ul className="space-y-4">
                {entries.map((entry, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    >
                        <div className="flex items-center w-full">
                            <span className="mr-4 font-semibold text-lg text-gray-500">{index + 1}.</span>
                            {editingEntry && editingEntry.index === index ? (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingEntry.name}
                                        onChange={handleEntryChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    />
                                    <input
                                        type="number"
                                        name="duration"
                                        value={Math.max(1, Math.round(editingEntry.duration / 60000))}
                                        onChange={handleEntryChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                    />
                                    <select
                                        name="entry_type"
                                        value={editingEntry.entry_type}
                                        onChange={handleEntryChange}
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
                                                onChange={handleEntryChange}
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
                                                onChange={handleEntryChange}
                                                placeholder="Workshop Map ID"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                            />
                                            <input
                                                type="text"
                                                name="workshop_map_file"
                                                value={editingEntry.workshop_map_file}
                                                onChange={handleEntryChange}
                                                placeholder="Workshop Map File"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                            />
                                        </>
                                    )}
                                    <textarea
                                        name="notes"
                                        value={editingEntry.notes}
                                        onChange={handleEntryChange}
                                        placeholder="Notes"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 mb-2"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={saveEditingEntry}
                                            className="p-2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <Save size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEditingEntry}
                                            className="p-2 text-gray-500 hover:text-gray-600 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-grow">
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
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            type="button"
                                            onClick={() => startEditingEntry(entry, index)}
                                            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeEntry(index)}
                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        {serverErrors?.entries && serverErrors.entries[index] && (
                            <p className="text-red-500 text-sm mt-1">
                                {Object.values(serverErrors.entries[index]).join(', ')}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EntryList;
