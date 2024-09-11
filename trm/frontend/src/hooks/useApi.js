// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = null) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios({
                method,
                url: `${config.apiUrl}${url}`,
                data,
            });
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An unknown error occurred');
            setLoading(false);
            throw err;
        }
    }, []);

    const get = useCallback((url) => request('get', url), [request]);
    const post = useCallback((url, data) => request('post', url, data), [request]);
    const put = useCallback((url, data) => request('put', url, data), [request]);
    const del = useCallback((url) => request('delete', url), [request]);

    return { get, post, put, del, loading, error };
};

export default useApi;
