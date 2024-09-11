import React, { useState, useEffect } from 'react';
import RoutineHeader from './RoutineHeader';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import Modal from '../Modal';

const RoutineForm = ({ initialRoutine, onSubmit, submitButtonText, serverErrors }) => {
    const [routine, setRoutine] = useState(initialRoutine);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
            entries: [...routine.entries, { ...newEntry, id: Date.now(), order: routine.entries.length }],
        });
    };

    const updateEntry = (updatedEntry, index) => {
        const updatedEntries = [...routine.entries];
        updatedEntries[index] = updatedEntry;
        setRoutine({ ...routine, entries: updatedEntries });
    };

    const removeEntry = (index) => {
        const updatedEntries = routine.entries.filter((_, i) => i !== index);
        const reorderedEntries = updatedEntries.map((entry, i) => ({ ...entry, order: i }));
        setRoutine({ ...routine, entries: reorderedEntries });
    };

    const reorderEntries = (oldIndex, newIndex) => {
        setRoutine((prev) => {
            const updatedEntries = Array.from(prev.entries);
            const [reorderedItem] = updatedEntries.splice(oldIndex, 1);
            updatedEntries.splice(newIndex, 0, reorderedItem);
            const reorderedEntries = updatedEntries.map((entry, i) => ({ ...entry, order: i }));
            return { ...prev, entries: reorderedEntries };
        });
    };

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (hasUnsavedChanges) {
            showModal(
                'Unsaved Changes',
                'You have unsaved changes in your entries. Do you want to continue without saving?'
            );
        } else {
            submitRoutine();
        }
    };

    const submitRoutine = () => {
        const sortedEntries = [...routine.entries].sort((a, b) => a.order - b.order);
        onSubmit({ ...routine, entries: sortedEntries });
    };

    const handleUnsavedChanges = (hasChanges) => {
        setHasUnsavedChanges(hasChanges);
    };

    return (
        <form onSubmit={handleSubmit}>
            <RoutineHeader routine={routine} handleRoutineChange={handleRoutineChange} serverErrors={serverErrors} />
            <EntryForm addEntry={addEntry} showModal={showModal} />
            <EntryList
                entries={routine.entries}
                updateEntry={updateEntry}
                removeEntry={removeEntry}
                reorderEntries={reorderEntries}
                serverErrors={serverErrors}
                onUnsavedChanges={handleUnsavedChanges}
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
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                            submitRoutine();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        Continue Without Saving
                    </button>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </Modal>
        </form>
    );
};

export default RoutineForm;
