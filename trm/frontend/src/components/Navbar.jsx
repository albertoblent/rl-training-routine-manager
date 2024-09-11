// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img src={logoImage} alt="Logo" className="h-10 w-auto" />
                </Link>
                <div className="flex items-center space-x-4">
                    {/* <Link to="/" className="text-gray-600 hover:text-blue-500">
                        Home
                    </Link> */}
                    <Link
                        to="/routine/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircle className="mr-2" size={20} />
                        Create New Routine
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
