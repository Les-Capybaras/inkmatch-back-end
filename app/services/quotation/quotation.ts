import Artist from '#models/artist'
import puppeteer from 'puppeteer'
import { randomUUID } from 'node:crypto'
import env from '#start/env'
import Appointement from '#models/appointement'

export default class QuotationService {
  async generateQuotation(artist: Artist, appointement: Appointement) {
    await this.incrementQuoteNumber(artist)
    const uuid = randomUUID()
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

    await page.goto(`${env.get('API_URL')}/${artist.id}/quotation/${appointement.id}`, {
      waitUntil: 'networkidle2',
    })
    await page.pdf({ path: `uploads/quotations/quotation-${uuid}.pdf`, format: 'A4' })
    await browser.close()

    return `uploads/quotations/quotation-${uuid}.pdf`
  }

  getQuotationPricing(QuotationTotalAmount: number) {
    const tva = QuotationTotalAmount * 0.2
    const ttc = QuotationTotalAmount
    const ht = ttc - tva
    return {
      ht,
      tva,
      ttc,
    }
  }

  async incrementQuoteNumber(artist: Artist) {
    artist.quoteNumber += 1
    await artist.save()
  }
}
