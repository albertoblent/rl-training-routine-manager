import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Download, Trash2, Edit2 } from 'lucide-react';

const HomePage = () => {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const response = await axios.get('/api/routines/');
            setRoutines(response.data);
        } catch (error) {
            console.error('Error fetching routines:', error);
        }
    };

    const exportRoutine = async (routine) => {
        try {
            const response = await axios.get(`/api/routines/${routine.id}/export/`);
            const exportData = response.data;

            // Format the data for RL Training Timer
            const formattedData = {
                Duration: exportData.duration,
                Entries: exportData.entries.map((entry) => ({
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
                    WorkshopMapPath:
                        entry.entry_type === 3 ? `${entry.workshop_map_id}\\${entry.workshop_map_file}` : '',
                })),
                Id: exportData.id,
                Name: exportData.name,
                ReadOnly: false,
            };

            const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${routine.name.replace(/\s+/g, '_')}_routine.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting routine:', error);
            alert('Error exporting routine. Please try again.');
        }
    };

    const deleteRoutine = async (id) => {
        if (window.confirm('Are you sure you want to delete this routine?')) {
            try {
                await axios.delete(`/api/routines/${id}/delete/`);
                alert('Routine deleted successfully');
                fetchRoutines(); // Refresh the list
            } catch (error) {
                console.error('Error deleting routine:', error);
                alert('Error deleting routine. Please try again.');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Training Routines</h1>
            <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-6"
            >
                <PlusCircle className="mr-2" size={20} />
                Create New Routine
            </Link>
            <ul className="space-y-4">
                {routines.map((routine) => (
                    <li
                        key={routine.id}
                        className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
                    >
                        <div>
                            <Link
                                to={`/routine/${routine.id}`}
                                className="text-lg font-semibold text-blue-600 hover:underline"
                            >
                                {routine.name}
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">{Math.round(routine.duration / 60000)} minutes</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => exportRoutine(routine)}
                                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                                title="Export"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={() => deleteRoutine(routine.id)}
                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>
                            <Link
                                to={`/routine/${routine.id}/edit`}
                                className="p-2 text-gray-600 hover:text-green-500 transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={20} />
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
