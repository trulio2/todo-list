import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  app.enableCors({
    origin: '*',
  })

  await app.listen(port)
  logger.verbose(`Application listening on port ${port}`)
}
bootstrap()
