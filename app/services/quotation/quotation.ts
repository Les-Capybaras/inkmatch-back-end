import Artist from '#models/artist'
import puppeteer from 'puppeteer'
import { randomUUID } from 'node:crypto'
import env from '#start/env'

export default class QuotationService {
  async generateQuotation(artist: Artist) {
    const uuid = randomUUID()
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

    await page.goto(`${env.get('API_URL')}/${artist.id}/quotation`, { waitUntil: 'networkidle2' })
    await page.pdf({ path: `uploads/quotations/quotation-${uuid}.pdf`, format: 'A4' })
    await browser.close()

    return `uploads/quotations/quotation-${uuid}.pdf`
  }
}
