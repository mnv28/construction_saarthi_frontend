import http from '../../../services/http';

export const getDPRList = async ({ workspaceId, projectId, startDate, endDate }) => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspace_id', workspaceId);
    if (projectId) params.append('project_id', projectId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await http.get(`/daily-progress-report?${params.toString()}`);
    return response?.data || response;
};

export const getDPRDetails = async (reportId) => {
    const response = await http.get(`/daily-progress-report/${reportId}`);
    return response?.data || response;
};
