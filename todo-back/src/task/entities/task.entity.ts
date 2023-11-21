import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('task')
export class Task {
  @ObjectIdColumn()
  _id: string

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column({ type: 'date' })
  duedate: string

  @Column({ default: false })
  done: boolean

  @Column({ default: false })
  hide: boolean
}
