import React, { Component } from 'react';
import { AlertOctagon } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center"
                    role="alert"
                >
                    <AlertOctagon className="mr-2 h-5 w-5" />
                    <span>
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">
                            {this.state.error.message || 'An unexpected error occurred.'}
                        </span>
                    </span>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
