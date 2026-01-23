import { useState, useCallback, useEffect } from 'react';
import { getDPRList } from '../api/dprApi';
import { showError } from '../../../utils/toast';

export const useDPRLogs = ({ workspaceId, projectId, startDate, endDate }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = useCallback(async () => {
        if (!workspaceId || !projectId || projectId === ':projectId') return;

        // Only fetch if a date range is selected and valid
        if (!startDate || !endDate || startDate === 'Invalid date' || endDate === 'Invalid date') {
            setLogs([]);
            return;
        }

        try {
            setIsLoading(true);
            const data = await getDPRList({ workspaceId, projectId, startDate, endDate });
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching DPR logs:', error);
            showError('Failed to fetch daily progress reports');
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, projectId, startDate, endDate]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        isLoading,
        refetch: fetchLogs
    };
};
