import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value)

    if (!validObjectId) {
      throw new BadRequestException(`${value} is not a valid ObjectId`)
    }

    return Types.ObjectId.createFromHexString(value)
  }
}
