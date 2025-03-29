import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface Article {
  title: string;
  url: string;
  imageUrl: string;
  date: string;
  isToday: boolean;
}

export const scrapeBarcaNews = async (includeToday = false) => {
  try {
    const SITE_URL = 'https://www.barcablaugranes.com/';
    console.log(`Scraping news from: ${SITE_URL}`);
    
    // Get dates in multiple possible formats
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateFormats = {
      yesterday: [
        yesterday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).trim(),
        yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).trim(),
        `${yesterday.getDate()} ${yesterday.toLocaleDateString('en-US', { month: 'long' })}`,
      ],
      today: [
        today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).trim(),
        today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).trim(),
        `${today.getDate()} ${today.toLocaleDateString('en-US', { month: 'long' })}`,
      ]
    };

    const response = await fetch(SITE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.text();
    const $ = cheerio.load(body);
    const results: Article[] = [];

    // Try multiple selector patterns
    $('.c-compact-river_entry, .c-entry-box--compact').each((_, entry) => {
      const $entry = $(entry);
      
      // More flexible URL selection
      const articleLink = $entry.find('a[href*="/202"]').first();
      const articleUrl = articleLink.attr('href') || '';
      
      // Improved image selection with multiple fallbacks
      const img = $entry.find('img.c-dynamic-image[data-chorus-optimize-field="main_image"], img[src*="vox-cdn.com"]').first();
      let imgUrl = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';    
      // More flexible date selection
      const dateElement = $entry.find('time, .c-byline time, .c-meta__item time').first();
      const articleDate = dateElement.text().trim().replace(/\s+/g, ' ');
      
      // More flexible title selection
      const title = $entry.find('h2, .c-entry-box--compact_title, .c-entry__title').text().trim() || 'No title';

      // Check if article matches our date filters
      const isToday = dateFormats.today.some(format => articleDate.includes(format));
      const isYesterday = dateFormats.yesterday.some(format => articleDate.includes(format));
      
      if (isYesterday || (includeToday && isToday)) {
        results.push({
          title,
          url: articleUrl.startsWith('http') ? articleUrl : `https://www.barcablaugranes.com${articleUrl}`,
          imageUrl: imgUrl,
          date: articleDate,
          isToday
        });
      }
    });

    if (results.length === 0) {
      console.warn('⚠️ Possible scraping issues - no articles matched date filters');
      console.warn('Sample HTML:', $('.c-compact-river_entry').first().html());
    }

    return {
      dateFilter: {
        yesterday: dateFormats.yesterday[0],
        today: dateFormats.today[0],
        includeToday
      },
      articles: results
    };
  } catch (error) {
    console.error('❌ News scraping failed:', error);
    throw new Error(`News scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};