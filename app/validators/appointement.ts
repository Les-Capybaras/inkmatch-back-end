import vine from '@vinejs/vine'

export const requestAppointementCreation = vine.compile(
  vine.object({
    date: vine.date().afterOrEqual('today'),
    description: vine.string(),
    artistId: vine.number(),
    fileId: vine.number().optional(),
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
