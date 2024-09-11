import React from 'react';
import { Loader } from 'lucide-react';

const Loading = ({ size = 32, color = 'text-blue-500' }) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader className={`animate-spin h-${size} w-${size} ${color}`} />
        </div>
    );
};

export default Loading;
