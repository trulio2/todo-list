import { DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { Task } from '../task/entities'

config({ path: `.env.${process.env.NODE_ENV}` })

export const dataSourceOptions: DataSourceOptions = {
  type: 'mongodb',
  url: process.env.MONGO_URL,
  entities: [Task],
  synchronize: true,
}
