import { BASE_URL } from "./consants";
import axios from "axios";

/**
 * Relative api echo
 */
const e = path => axios.get(`${BASE_URL}${path}`);

/**
 * Get live runners
 */
const getLiveRunners = () => e("/liverunners").then(streams => streams.data);


export default {
  getLiveRunners
};
