// src/components/RoutineForm/RoutineHeader.jsx
import React from 'react';
import { Clock } from 'lucide-react';

const RoutineHeader = ({ routine, handleRoutineChange, serverErrors }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">{routine.id ? 'Edit Training Routine' : 'Create Training Routine'}</h1>
        <div className="mb-4">
            <input
                type="text"
                name="name"
                value={routine.name}
                onChange={handleRoutineChange}
                placeholder="Routine Name"
                className={`w-full px-3 py-2 border ${
                    serverErrors?.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
            />
            {serverErrors?.name && <p className="text-red-500 text-sm mt-1">{serverErrors.name}</p>}
        </div>
        <p className="text-gray-600 flex items-center">
            <Clock className="mr-2" size={20} />
            Total Duration: {Math.round(routine.duration / 60000)} minutes
        </p>
    </div>
);

export default RoutineHeader;
