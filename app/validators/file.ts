import vine from '@vinejs/vine'

export const requestFileUpload = vine.compile(
  vine.object({
    file: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    }),
  })
)
