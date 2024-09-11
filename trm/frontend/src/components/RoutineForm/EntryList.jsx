// src/components/RoutineForm/EntryList.jsx
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircle, Clock, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import { validateTrainingPackCode } from './utils';
import Modal from '../Modal';

const SortableItem = ({
    entry,
    index,
    onEdit,
    onRemove,
    isEditing,
    editingEntry,
    onEntryChange,
    onSave,
    onCancel,
    trainingPackError,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entry.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
        >
            <div className="flex items-center w-full">
                <span {...listeners} className="mr-4 cursor-move">
                    <GripVertical size={20} />
                </span>
                <span className="mr-4 font-semibold text-lg text-gray-500">{index + 1}.</span>
                {isEditing ? (
                    <div className="w-full">
                        <input
                            type="text"
                            name="name"
                            value={editingEntry.name}
                            onChange={onEntryChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <input
                            type="number"
                            name="duration"
                            value={Math.max(1, Math.round(editingEntry.duration / 60000))}
                            onChange={onEntryChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <select
                            name="entry_type"
                            value={editingEntry.entry_type}
                            onChange={onEntryChange}
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
                                    onChange={onEntryChange}
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
                                    onChange={onEntryChange}
                                    placeholder="Workshop Map ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                />
                                <input
                                    type="text"
                                    name="workshop_map_file"
                                    value={editingEntry.workshop_map_file}
                                    onChange={onEntryChange}
                                    placeholder="Workshop Map File"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                />
                            </>
                        )}
                        <textarea
                            name="notes"
                            value={editingEntry.notes}
                            onChange={onEntryChange}
                            placeholder="Notes"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onSave}
                                className="p-2 text-green-500 hover:text-green-600 transition-colors"
                            >
                                <Save size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
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
                                onClick={() => onEdit(entry, index)}
                                className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </li>
    );
};

const EntryList = ({ entries, updateEntry, removeEntry, reorderEntries, serverErrors, onUnsavedChanges }) => {
    const [editingEntry, setEditingEntry] = useState(null);
    const [trainingPackError, setTrainingPackError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        onUnsavedChanges(hasUnsavedChanges);
    }, [hasUnsavedChanges, onUnsavedChanges]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = entries.findIndex((entry) => entry.id === active.id);
            const newIndex = entries.findIndex((entry) => entry.id === over.id);
            reorderEntries(oldIndex, newIndex);
        }
    };

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
        setHasUnsavedChanges(true);
    };

    const startEditingEntry = (entry, index) => {
        setEditingEntry({ ...entry, index });
        if (entry.entry_type === 2) {
            setTrainingPackError(validateTrainingPackCode(entry.training_pack_code));
        }
        setHasUnsavedChanges(true);
    };

    const cancelEditingEntry = () => {
        setEditingEntry(null);
        setTrainingPackError('');
        setHasUnsavedChanges(false);
    };

    const saveEditingEntry = () => {
        if (editingEntry.entry_type === 2 && trainingPackError) {
            setModalContent({
                title: 'Invalid Training Pack Code',
                message: 'Please enter a valid training pack code before saving.',
            });
            setIsModalOpen(true);
            return;
        }
        updateEntry(editingEntry, editingEntry.index);
        setEditingEntry(null);
        setTrainingPackError('');
        setHasUnsavedChanges(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Entries</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={entries.map((entry) => entry.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-4">
                        {entries.map((entry, index) => (
                            <SortableItem
                                key={entry.id}
                                entry={entry}
                                index={index}
                                onEdit={startEditingEntry}
                                onRemove={removeEntry}
                                isEditing={editingEntry && editingEntry.id === entry.id}
                                editingEntry={editingEntry}
                                onEntryChange={handleEntryChange}
                                onSave={saveEditingEntry}
                                onCancel={cancelEditingEntry}
                                trainingPackError={trainingPackError}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            {entries.length === 0 && (
                <p className="text-gray-500 text-center mt-4">No entries yet. Add some entries to your routine!</p>
            )}
            {serverErrors && serverErrors.entries && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {Object.values(serverErrors.entries).map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                <p>{modalContent.message}</p>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    OK
                </button>
            </Modal>
        </div>
    );
};

export default EntryList;
