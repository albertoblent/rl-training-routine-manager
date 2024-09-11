import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import RoutineHeader from './RoutineHeader';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import Modal from '../Modal';
import ErrorBoundary from '../common/ErrorBoundary';

const RoutineForm = ({ initialRoutine, onSubmit, submitButtonText, serverErrors }) => {
    const [routine, setRoutine] = useState({
        ...initialRoutine,
        entries: Array.isArray(initialRoutine.entries) ? initialRoutine.entries : [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const totalDuration = routine.entries.reduce((sum, entry) => sum + entry.duration, 0);
        setRoutine((prev) => ({ ...prev, duration: totalDuration }));
    }, [routine.entries]);

    useEffect(() => {
        setRoutine({
            ...initialRoutine,
            entries: Array.isArray(initialRoutine.entries) ? initialRoutine.entries : [],
        });
    }, [initialRoutine]);

    const handleRoutineChange = (e) => {
        setRoutine({ ...routine, [e.target.name]: e.target.value });
        // Clear the error for this field when it's changed
        setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[e.target.name];
            return newErrors;
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!routine.name.trim()) {
            errors.name = 'Routine name is required';
        }
        if (routine.entries.length === 0) {
            errors.entries = 'At least one entry is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
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
        if (!validateForm()) {
            return;
        }
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
        <ErrorBoundary>
            <form onSubmit={handleSubmit}>
                {(Object.keys(formErrors).length > 0 || (serverErrors && Object.keys(serverErrors).length > 0)) && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                        role="alert"
                    >
                        <AlertTriangle className="inline-block mr-2 h-5 w-5" />
                        <strong className="font-bold">Please correct the following errors:</strong>
                        <ul className="list-disc list-inside mt-2">
                            {Object.entries(formErrors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                            {serverErrors &&
                                Object.entries(serverErrors).map(([key, value]) => <li key={key}>{value}</li>)}
                        </ul>
                    </div>
                )}
                <RoutineHeader routine={routine} handleRoutineChange={handleRoutineChange} errors={formErrors} />
                <EntryForm addEntry={addEntry} showModal={showModal} />
                <EntryList
                    entries={routine.entries}
                    updateEntry={updateEntry}
                    removeEntry={removeEntry}
                    reorderEntries={reorderEntries}
                    onUnsavedChanges={handleUnsavedChanges}
                />
                <div className="flex justify-between items-center mt-4">
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
        </ErrorBoundary>
    );
};

export default RoutineForm;
