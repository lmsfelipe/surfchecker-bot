import { request } from './axiosRequest';

const throwErrorMessage = () => {
  console.error('Error: No surf Spot found in the message');

  throw new Error(
    'Não encontramos o pico mencionado na sua mensagem. Por favor, revise a mensagem e adicione o nome do pico e a cidade.',
  );
};

export async function serperAPI(
  message: string,
): Promise<{ domain: string; url: string; tagToScrape: string[] }[]> {
  const data = JSON.stringify({
    q: message,
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

    const findResultByDomain = (domain: string) => {
      return response.data.organic.find(
        (item: any) =>
          typeof item.link === 'string' && item.link.includes(domain),
      );
    };

    const surfguruResult = findResultByDomain('surfguru');
    const wavesResult = findResultByDomain('waves');

    if (!surfguruResult && !wavesResult) {
      return throwErrorMessage();
    }

    const surfForescastSitesResults = [
      ...(surfguruResult?.link
        ? [
            {
              domain: 'surfguru',
              url: `${surfguruResult.link}?tipo=tabela`,
              tagToScrape: ['#diario_semana'],
            },
          ]
        : []),
      ...(wavesResult?.link
        ? [
            {
              domain: 'waves',
              url: wavesResult.link,
              tagToScrape: ['#forecast-table'],
            },
          ]
        : []),
    ];

    return surfForescastSitesResults;
  } catch (error) {
    console.error('Error fetching data from Serper API:', error);
    return throwErrorMessage();
  }
}
