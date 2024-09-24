import vine from '@vinejs/vine'

export const requestAppointementCreation = vine.compile(
  vine.object({
    date: vine.date().afterOrEqual('today'),
    description: vine.string(),
    artistId: vine.number(),
    fileId: vine.number().optional(),
    duration: vine.string().regex(/^\d{2}:\d{2}$/),
    startTime: vine.string().regex(/^\d{2}:\d{2}$/),
  })
)

export const requestAppointementCreationArtist = vine.compile(
  vine.object({
    date: vine.date().afterOrEqual('today'),
    description: vine.string(),
    userId: vine.number(),
    fileId: vine.number().optional(),
  })
)
