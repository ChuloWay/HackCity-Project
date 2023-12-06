import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedUserTable1701791317195 implements MigrationInterface {
  name = 'ModifiedUserTable1701791317195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "isSocialLogin" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isSocialLogin"`);
  }
}
