import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export default class CleanupQuotation extends BaseCommand {
  static commandName = 'cleanup:quotation'
  static description = 'This command aims to cleanup the quotation in uploads folder'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "CleanupQuotation"')

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const uploadsPath = path.join(__dirname, '..', 'uploads/quotations')
    const files = fs.readdirSync(uploadsPath)

    files.map((file) => {
      if (file.includes('quotation')) {
        fs.unlinkSync(path.join(uploadsPath, file))
      }
    })

    this.logger.success('Quotation files have been cleaned up')
  }
}
