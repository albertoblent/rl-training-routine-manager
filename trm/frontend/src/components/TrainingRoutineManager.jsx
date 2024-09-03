// src/components/TrainingRoutineManager.js
import React, { useState } from 'react';
import axios from 'axios';

const TrainingRoutineManager = () => {
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

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const handleEntryChange = (e) => {
        setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
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

    const saveRoutine = async () => {
        try {
            const response = await axios.post('/api/routines/create/', routine, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Routine saved:', response.data);
            // Handle success (e.g., show a success message, clear the form)
            alert('Routine saved successfully!');
            setRoutine({ name: '', duration: 0, entries: [] });
        } catch (error) {
            console.error('Error saving routine:', error.response ? error.response.data : error.message);
            // Handle error (e.g., show an error message)
            alert('Error saving routine. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create Training Routine</h1>
            <div>
                <input
                    type="text"
                    name="name"
                    value={routine.name}
                    onChange={handleRoutineChange}
                    placeholder="Routine Name"
                />
                <input
                    type="number"
                    name="duration"
                    value={routine.duration}
                    onChange={handleRoutineChange}
                    placeholder="Total Duration (ms)"
                />
            </div>
            <h2>Add Entry</h2>
            <div>
                <input
                    type="text"
                    name="name"
                    value={newEntry.name}
                    onChange={handleEntryChange}
                    placeholder="Entry Name"
                />
                <input
                    type="number"
                    name="duration"
                    value={newEntry.duration}
                    onChange={handleEntryChange}
                    placeholder="Duration (ms)"
                />
                <select name="entry_type" value={newEntry.entry_type} onChange={handleEntryChange}>
                    <option value={1}>Freeplay</option>
                    <option value={2}>Custom Training Pack</option>
                    <option value={3}>Workshop Map</option>
                </select>
                {newEntry.entry_type === 2 && (
                    <input
                        type="text"
                        name="training_pack_code"
                        value={newEntry.training_pack_code}
                        onChange={handleEntryChange}
                        placeholder="Training Pack Code"
                    />
                )}
                {newEntry.entry_type === 3 && (
                    <>
                        <input
                            type="text"
                            name="workshop_map_id"
                            value={newEntry.workshop_map_id}
                            onChange={handleEntryChange}
                            placeholder="Workshop Map ID"
                        />
                        <input
                            type="text"
                            name="workshop_map_file"
                            value={newEntry.workshop_map_file}
                            onChange={handleEntryChange}
                            placeholder="Workshop Map File"
                        />
                    </>
                )}
                <textarea name="notes" value={newEntry.notes} onChange={handleEntryChange} placeholder="Notes" />
                <button onClick={addEntry}>Add Entry</button>
            </div>
            <h2>Entries</h2>
            <ul>
                {routine.entries.map((entry, index) => (
                    <li key={index}>
                        {entry.name} - {entry.duration}ms
                        <button onClick={() => removeEntry(index)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={saveRoutine}>Save Routine</button>
        </div>
    );
};

export default TrainingRoutineManager;
