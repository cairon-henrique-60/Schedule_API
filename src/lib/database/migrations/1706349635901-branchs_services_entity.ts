import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class BranchServiceEntity1706349635901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'branchs_services',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            default: 'UUID()',
            isPrimary: true,
          },
          {
            name: 'banch_id',
            type: 'varchar',
          },
          {
            name: 'service_id',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'branchs_services',
      new TableForeignKey({
        columnNames: ['banch_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branchs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'branchs_services',
      new TableForeignKey({
        columnNames: ['service_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'services',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('branchs_services', 'banch_id');

    await queryRunner.dropForeignKey('branchs_services', 'service_id');

    await queryRunner.dropTable('branchs_services');
  }
}
