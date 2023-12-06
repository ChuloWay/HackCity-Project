import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { SocialLogin } from './social-login.entity';
import * as bcrypt from 'bcryptjs';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  username: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    select: false,
    nullable: true,
  })
  password: string;

  @Column({ default: false })
  isSocialLogin: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => SocialLogin, (socialLogin) => socialLogin.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  socialLogins: SocialLogin[];

  @OneToMany(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  tokens: Token[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}
