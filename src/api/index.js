import axios from 'axios';

const DEBUG = process.env.NODE_ENV !== 'production';
const API_URI = DEBUG ? 'http://localhost:3000/api' : '/api';

const getGames = () => axios.get(`${API_URI}/games`);

export default {
    getGames,
};
