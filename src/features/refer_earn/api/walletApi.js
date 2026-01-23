import http from '../../../services/http';

const BASE_PATH = '/wallet';

export const getWalletSummary = () => {
    return http.get(`${BASE_PATH}/summary`);
};
