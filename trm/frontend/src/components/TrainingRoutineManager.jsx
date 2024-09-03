// src/components/TrainingRoutineManager.js
import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const handleEntryChange = (e) => {
        const { name, value } = e.target;
        if (name === 'duration') {
            setNewEntry({ ...newEntry, [name]: parseInt(value) * 60000 });
        } else if (name === 'entry_type') {
            setNewEntry({ ...newEntry, [name]: parseInt(value) });
        } else {
            setNewEntry({ ...newEntry, [name]: value });
        }
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
            alert('Routine saved successfully!');
            setRoutine({ name: '', duration: 0, entries: [] });
        } catch (error) {
            console.error('Error saving routine:', error.response ? error.response.data : error.message);
            alert('Error saving routine. Please try again.');
        }
    };

    const exportRoutine = () => {
        const exportData = {
            Duration: routine.duration,
            Entries: routine.entries.map((entry) => ({
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
                WorkshopMapPath: entry.entry_type === 3 ? `${entry.workshop_map_id}\\${entry.workshop_map_file}` : '',
            })),
            Id: crypto.randomUUID(),
            Name: routine.name,
            ReadOnly: false,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${routine.name.replace(/\s+/g, '_')}_routine.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                <p>Total Duration: {Math.round(routine.duration / 60000)} minutes</p>
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
                    value={Math.round(newEntry.duration / 60000)}
                    onChange={handleEntryChange}
                    placeholder="Duration (minutes)"
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
                        {entry.name} - {Math.round(entry.duration / 60000)} minutes
                        {entry.entry_type === 2 && ` - Pack: ${entry.training_pack_code}`}
                        {entry.entry_type === 3 && ` - Map: ${entry.workshop_map_id}/${entry.workshop_map_file}`}
                        <button onClick={() => removeEntry(index)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={saveRoutine}>Save Routine</button>
            <button onClick={exportRoutine}>Export Routine</button>
        </div>
    );
};

export default TrainingRoutineManager;
