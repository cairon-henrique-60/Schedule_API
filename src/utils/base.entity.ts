import {
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string | null;

  @DeleteDateColumn({ type: 'timestamp', default: null })
  deletedAt: string | null;

  @BeforeInsert()
  updateCreateDate() {
    const brazilTimeZone = 'America/Sao_Paulo';
    this.createdAt = moment().tz(brazilTimeZone).format('YYYY-MM-DD HH:mm:ss');
  }

  @BeforeUpdate()
  updateUpdateDate() {
    if (this.updatedAt === null) {
      const brazilTimeZone = 'America/Sao_Paulo';
      this.updatedAt = moment()
        .tz(brazilTimeZone)
        .format('YYYY-MM-DD HH:mm:ss');
    }
  }

  @BeforeRemove()
  updateDeleteDate() {
    const brazilTimeZone = 'America/Sao_Paulo';
    this.deletedAt = moment().tz(brazilTimeZone).format('YYYY-MM-DD HH:mm:ss');
  }
}
