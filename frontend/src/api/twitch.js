import axios from "axios";

/**
 * Relative api echo
 */
const e = path => axios.get(`${process.env.VUE_APP_API_BASE_URL}${path}`);

/**
 * Get live runners
 */
const getLiveRunners = () => e("/liverunners").then(streams => streams.data);


export default {
  getLiveRunners
};
