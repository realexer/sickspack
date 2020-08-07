import ApiRequest from "../ApiRequest";
import fetch from 'node-fetch';

ApiRequest.setFetch(fetch);

export default ApiRequest;