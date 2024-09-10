// src/components/RoutineForm/RoutineForm.jsx
import React, { useState, useEffect } from 'react';
import RoutineHeader from './RoutineHeader';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import Modal from '../Modal';

const RoutineForm = ({ initialRoutine, onSubmit, submitButtonText, serverErrors }) => {
    const [routine, setRoutine] = useState(initialRoutine);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
    };

    const addEntry = (newEntry) => {
        setRoutine({
            ...routine,
            entries: [...routine.entries, { ...newEntry, order: routine.entries.length }],
        });
    };

    const updateEntry = (updatedEntry, index) => {
        const updatedEntries = [...routine.entries];
        updatedEntries[index] = updatedEntry;
        setRoutine({ ...routine, entries: updatedEntries });
    };

    const removeEntry = (index) => {
        const updatedEntries = routine.entries.filter((_, i) => i !== index);
        setRoutine({ ...routine, entries: updatedEntries });
    };

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(routine);
    };

    return (
        <form onSubmit={handleSubmit}>
            <RoutineHeader routine={routine} handleRoutineChange={handleRoutineChange} serverErrors={serverErrors} />
            <EntryForm addEntry={addEntry} showModal={showModal} />
            <EntryList
                entries={routine.entries}
                updateEntry={updateEntry}
                removeEntry={removeEntry}
                serverErrors={serverErrors}
            />
            <div className="flex justify-between items-center">
                <button
                    type="submit"
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    {submitButtonText}
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                <p>{modalContent.message}</p>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    OK
                </button>
            </Modal>
        </form>
    );
};

export default RoutineForm;
