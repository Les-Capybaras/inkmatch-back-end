import vine from '@vinejs/vine'
import { FileType } from '../enums/file_type.js'

export const requestFileUpload = vine.compile(
  vine.object({
    file: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    }),
    type: vine.enum(FileType),
  })
)
