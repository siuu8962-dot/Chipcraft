export type AppAction =
  | { type: 'navigate'; path: string }
  | { type: 'click'; selector: string; description: string }
  | { type: 'read_page'; selector?: string }
  | { type: 'fill_input'; selector: string; value: string }
  | { type: 'scroll'; direction: 'up' | 'down'; amount?: number }
  | { type: 'wait'; ms: number }
  | { type: 'get_page_content' }
  | { type: 'find_element'; description: string }

export type AppActionResult = {
  success: boolean
  data: string
  error?: string
}

export class AppController {
  private router: any

  constructor(router: any) {
    this.router = router
  }

  async execute(action: AppAction): Promise<AppActionResult> {
    try {
      switch (action.type) {
        case 'navigate': {
          this.router.push(action.path)
          await this.wait(1200) // Wait for Next.js navigation + potential data fetch
          const content = this.getPageText()
          return { 
            success: true, 
            data: `Đã chuyển đến ${action.path}. Nội dung trang:\n${content}`
          }
        }

        case 'click': {
          const el = this.findElement(action.selector, action.description)
          if (!el) {
            return { 
              success: false, 
              data: '',
              error: `Không tìm thấy phần tử: "${action.description}" (selector: ${action.selector})`
            }
          }
          ;(el as HTMLElement).click()
          await this.wait(800)
          return { 
            success: true, 
            data: `Đã nhấn: "${action.description}". Trang đã cập nhật.`
          }
        }

        case 'fill_input': {
          const input = document.querySelector(action.selector) as HTMLInputElement
          if (!input) {
            return { success: false, data: '', error: `Không tìm thấy ô nhập liệu: ${action.selector}` }
          }
          input.focus()
          input.value = action.value
          
          // Trigger React's onChange handler
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set
          nativeInputValueSetter?.call(input, action.value)
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
          
          await this.wait(300)
          return { success: true, data: `Đã nhập giá trị: "${action.value}"` }
        }

        case 'read_page':
        case 'get_page_content': {
          const content = this.getPageText(action.type === 'read_page' ? action.selector : undefined)
          return { success: true, data: content }
        }

        case 'find_element': {
          const el = this.findElementByDescription(action.description)
          if (!el) {
            return { 
              success: false, 
              data: '',
              error: `Không tìm thấy phần tử nào khớp với mô tả: "${action.description}"`
            }
          }
          const tagInfo = `${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''}${el.className ? '.'+el.className.toString().split(' ')[0] : ''}`
          return { 
            success: true, 
            data: `Tìm thấy: <${tagInfo}> với nội dung: "${(el as HTMLElement).innerText?.slice(0,100)}"`
          }
        }

        case 'scroll': {
          const amount = action.amount || 300
          window.scrollBy(0, action.direction === 'down' ? amount : -amount)
          await this.wait(300)
          return { success: true, data: `Đã cuộn ${action.direction === 'down' ? 'xuống' : 'lên'}` }
        }

        case 'wait': {
          await this.wait(action.ms)
          return { success: true, data: `Đã đợi ${action.ms}ms` }
        }

        default:
          return { success: false, data: '', error: 'Loại hành động không hợp lệ' }
      }
    } catch (err: any) {
      return { success: false, data: '', error: err.message }
    }
  }

  private findElement(selector: string, description: string): Element | null {
    // Try direct selector first
    if (selector && selector !== 'button' && selector !== 'a' && selector !== 'input') {
      const direct = document.querySelector(selector)
      if (direct) return direct
    }

    // Fallback to text search
    return this.findElementByDescription(description)
  }

  private findElementByDescription(description: string): Element | null {
    const lower = description.toLowerCase()
    const candidates = Array.from(document.querySelectorAll(
      'button, a, input, textarea, [role="button"], [role="tab"], [role="link"], label'
    ))

    return candidates.find(el => {
      const text = (el as HTMLElement).innerText?.toLowerCase() || ''
      const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || ''
      const placeholder = el.getAttribute('placeholder')?.toLowerCase() || ''
      const title = el.getAttribute('title')?.toLowerCase() || ''
      
      return text.includes(lower) || 
             ariaLabel.includes(lower) || 
             placeholder.includes(lower) ||
             title.includes(lower)
    }) || null
  }

  private getPageText(selector?: string): string {
    const root = selector 
      ? document.querySelector(selector) 
      : document.body

    if (!root) return 'Không tìm thấy nội dung.'

    const clone = root.cloneNode(true) as HTMLElement
    clone.querySelectorAll('script, style, svg, img, nav, footer').forEach(el => el.remove())
    
    const text = clone.innerText || clone.textContent || ''
    return text.replace(/\s+/g, ' ').trim().slice(0, 3000)
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
