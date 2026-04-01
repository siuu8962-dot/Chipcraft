import * as cheerio from 'cheerio'

export class BrowserController {
  private currentUrl: string = ''
  private currentContent: string = ''

  // Navigate to URL using server-side fetch
  async navigate(url: string): Promise<string> {
    try {
      // Ensure URL has protocol
      let targetUrl = url
      if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      })

      if (!response.ok) {
        return `Error: HTTP ${response.status} for ${targetUrl}`
      }

      const html = await response.text()
      this.currentUrl = targetUrl
      
      // Parse with cheerio
      const $ = cheerio.load(html)
      
      // Remove noise
      $('script, style, nav, footer, header, aside, iframe, noscript').remove()
      
      const title = $('title').text().trim()
      const metaDesc = $('meta[name="description"]').attr('content') || ''
      
      // Extract main content
      const mainContent = $('main, article, .content, #content, .main').first()
      const bodyText = mainContent.length 
        ? mainContent.text() 
        : $('body').text()
      
      // Clean up whitespace
      const cleanText = bodyText
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, 4000)

      this.currentContent = cleanText
      
      return `✅ Page loaded: "${title}"\nURL: ${targetUrl}\nDescription: ${metaDesc}\n\nContent:\n${cleanText}`

    } catch (error: any) {
      if (error.name === 'TimeoutError') {
        return `Timeout: Could not load ${url} within 10 seconds`
      }
      return `Error navigating to ${url}: ${error.message}`
    }
  }

  // Search Google via DuckDuckGo (HTML version)
  async searchGoogle(query: string): Promise<string> {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    
    try {
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
        },
        signal: AbortSignal.timeout(8000)
      })
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
      const results: string[] = []
      
      $('.result').slice(0, 5).each((i, el) => {
        const title = $(el).find('.result__title').text().trim()
        const snippet = $(el).find('.result__snippet').text().trim()
        const link = $(el).find('.result__url').text().trim()
        
        if (title && snippet) {
          results.push(`${i + 1}. ${title}\n   ${link}\n   ${snippet}`)
        }
      })
      
      if (results.length === 0) {
        // Fallback: try navigating directly (some search engines block simple fetch)
        return await this.navigate(
          `https://www.google.com/search?q=${encodeURIComponent(query)}`
        )
      }
      
      return `Search results for: "${query}"\n\n${results.join('\n\n')}`
      
    } catch (error: any) {
      return `Search error: ${error.message}`
    }
  }

  // Extract specific info from current page
  async extract(instruction: string): Promise<string> {
    if (!this.currentContent) {
      return 'No page loaded. Use navigate first.'
    }
    return `Current page (${this.currentUrl}):\n${this.currentContent}`
  }

  // Get links from current page
  async getLinks(): Promise<string> {
    if (!this.currentUrl) return 'No page loaded.'
    
    try {
      const response = await fetch(this.currentUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' }
      })
      const html = await response.text()
      const $ = cheerio.load(html)
      
      const links: string[] = []
      $('a[href]').slice(0, 20).each((i, el) => {
        const href = $(el).attr('href') || ''
        const text = $(el).text().trim()
        if (href.startsWith('http') && text) {
          links.push(`- ${text}: ${href}`)
        }
      })
      
      return `Links on ${this.currentUrl}:\n${links.join('\n')}`
    } catch (e: any) {
      return `Error getting links: ${e.message}`
    }
  }

  // Read a specific section by heading
  async readSection(heading: string): Promise<string> {
    if (!this.currentContent) return 'No page loaded.'
    
    const idx = this.currentContent.toLowerCase().indexOf(heading.toLowerCase())
    if (idx === -1) return `Section "${heading}" not found on current page.`
    
    return this.currentContent.slice(idx, idx + 1500)
  }

  close() {
    this.currentUrl = ''
    this.currentContent = ''
  }
}

// Singleton instance
export const browserController = new BrowserController()
