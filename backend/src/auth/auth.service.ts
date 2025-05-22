import { PrismaService } from '@/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminRole } from '@prisma/client';
import { verify } from 'argon2';
import { omit } from 'lodash';
import { AdminService } from '../admin/admin.service';
import { AuthDto } from './dto/Auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private adminService: AdminService,
    private prisma: PrismaService,
  ) {}

  private readonly TOKEN_EXPIRATION_ACCESS = '1h';
  private readonly TOKEN_EXPIRATION_REFRESH = '1d';

  async login(dto: AuthDto, ipAddress: string) {
    const admin = await this.validateAdmin(dto);
    console.log(ipAddress);

    // const { encrypted: ipEncrypted, iv: ipIv } = encrypt(ipAddress);

    // const previousLog = await this.prisma.loginLog.findFirst({
    //   where: { userId: user.id, ipAddress },
    // });

    // if (!previousLog && ipAddress !== "unknown") {
    //   await this.emailService.sendEmail(
    //     user.email,
    //     "New Login Detected",
    //     `A new login was detected from IP ${ipAddress} at ${new Date().toISOString()}. If this wasn't you, please contact support.`
    //   );
    //   console.log(
    //     `A new login was detected from IP ${ipAddress} at ${new Date().toISOString()}. If this wasn't you, please contact support.`
    //   );
    // }

    // await this.prisma.loginLog.create({
    //   data: {
    //     userId: user.id,
    //     ipAddress: ipEncrypted,
    //     ipAddressIv: ipIv,
    //     action: 'login',
    //   },
    // });

    return this.buildResponseObject(admin);
  }

  // async cleanupOldLogs() {
  //   const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000); // 6 месяцев назад
  //   const deleted = await this.prisma.loginLog.deleteMany({
  //     where: {
  //       createdAt: {
  //         lt: sixMonthsAgo,
  //       },
  //     },
  //   });
  //   console.log(`Deleted ${deleted.count} old login logs`);
  //   return deleted;
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async handleCleanup() {
  //   console.log('Running cleanup task for old login logs');
  //   await this.cleanupOldLogs();
  // }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const admin = await this.adminService.getById(result.id);
    return this.buildResponseObject(admin);
  }

  async buildResponseObject(admin: Admin) {
    const tokens = await this.issueTokens(admin.id, admin.rights || []);
    return { admin: this.omitPassword(admin), tokens };
  }

  private async issueTokens(adminId: string, rights: AdminRole[]) {
    const payload = { id: adminId, rights };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_ACCESS,
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_REFRESH,
    });
    return { accessToken, refreshToken };
  }

  private async validateAdmin(dto: AuthDto) {
    const admin = await this.adminService.getByLogin(dto.login);
    if (!admin) {
      throw new UnauthorizedException('Login or password invalid');
    }
    const isValid = await verify(admin.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Email or password invalid');
    }
    return admin;
  }

  private omitPassword(admin: Admin) {
    return omit(admin, ['password']);
  }
}
