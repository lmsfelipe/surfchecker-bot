import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Scrape a website
export async function firecrawlAPI(
  url: string,
  includeTags: string[],
): Promise<string> {
  console.log('start scrape', url);

  const scrapeResponse = await app.scrapeUrl(url, {
    formats: ['markdown'],
    includeTags,
  });

  if (!scrapeResponse.success || !scrapeResponse.markdown) {
    return '';
  }

  return scrapeResponse.markdown;
}
