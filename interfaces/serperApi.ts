import axios from 'axios';
import { ExtractedLocation } from '../services/surfSpotExtractor';

// TODO: Refactor this function to isolate the API call and make it reusable
export async function serperAPI(location: ExtractedLocation) {
  const data = JSON.stringify({
    q: `previsão de ondas ${location.spot} em ${location.city} site:surfguru.com.br`,
    gl: 'br',
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    data,
  };

  return axios.request(config);
}
