import { useState, useEffect, useCallback } from 'react';
import { getWalletSummary } from '../api/walletApi';

export const useWallet = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWalletSummary = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getWalletSummary();
            setData(response.data || response);
            setError(null);
        } catch (err) {
            console.error('Error fetching wallet summary:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletSummary();
    }, [fetchWalletSummary]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchWalletSummary
    };
};
