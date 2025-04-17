import FirecrawlApp, {
  CrawlParams,
  CrawlStatusResponse,
} from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a website
export async function firecrawlAPI(url: string) {
  console.log('start scrape', url);

  const scrapeResponse = await app.scrapeUrl(url, {
    formats: ['markdown'],
  });

  if (!scrapeResponse.success) {
    throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
  }

  return scrapeResponse;
}

// import axios from 'axios';

// // TODO: Refactor this function to isolate the API call and make it reusable
// export async function firecrawlAPI(url: string): Promise<> {
//   const data = {
//     url,
//     formats: ['markdown'],
//     mobile: true,
//   };

//   const config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'https://api.firecrawl.dev/v1/scrape',
//     headers: {
//       Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     data,
//   };

//   return axios.request(config);
// }
