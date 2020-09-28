import ApiRequest from "../ApiRequest";
import fetchProxy from '../../../http-fetch-proxy';

ApiRequest.setFetch(fetchProxy);

export default ApiRequest;