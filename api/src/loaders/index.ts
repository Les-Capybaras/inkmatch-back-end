import { Application } from "express"
import databaseLoader from './database'
import expressLoader from './express'

export default async (app: Application) => {
  await databaseLoader()
  expressLoader(app)
}

