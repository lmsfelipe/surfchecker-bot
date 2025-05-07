import { request } from './axiosRequest';

const throwErrorMessage = () => {
  console.error('Error: No surf Spot found in the message');

  throw new Error(
    'Não encontramos o pico mencionado na sua mensagem. Por favor, revise a mensagem e adicione o nome do pico e a cidade.',
  );
};

export async function serperAPI(
  message: string,
): Promise<{ domain: string; url: string; tagToScrape: string[] }> {
  const data = JSON.stringify({
    q: `${message} previsão de surf`,
    gl: 'br',
  });

  const config = {
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await request.post(config.url, data, {
      headers: config.headers,
    });

    if (!response?.data?.organic) {
      return throwErrorMessage();
    }

    // Find the first matching domain in order of appearance
    for (const result of response.data.organic) {
      if (typeof result.link === 'string') {
        if (result.link.includes('surfguru')) {
          return {
            domain: 'surfguru',
            url: `${result.link}?tipo=tabela`,
            tagToScrape: ['#diario_semana'],
          };
        }
        if (result.link.includes('waves')) {
          return {
            domain: 'waves',
            url: result.link,
            tagToScrape: ['#forecast-table'],
          };
        }
      }
    }

    return throwErrorMessage();
  } catch (error) {
    console.error('Error fetching data from Serper API:', error);
    return throwErrorMessage();
  }
}
