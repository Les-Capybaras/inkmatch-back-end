import { BaseSeeder } from '@adonisjs/lucid/seeders'
import File from '#models/file'
import { FileType } from '../../app/enums/file_type.js'

export default class extends BaseSeeder {
  async run() {
    await File.createMany([
      {
        url: 'file1.jpg',
        ext: 'jpg',
        size: 1000,
        type: FileType.Image,
      },
      {
        url: 'file2.jpg',
        ext: 'jpg',
        size: 1000,
        type: FileType.Image,
      },
    ])
  }
}
