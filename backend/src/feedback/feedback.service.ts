import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendFeedbackDto } from '../event/dto/send-feeback.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteFeedback(feedbackId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: {
        id: feedbackId,
      },
    });

    if (!feedback) throw new NotFoundException('Feedback not found');

    return await this.prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
    });
  }

  async sendFeedback(
    dto: SendFeedbackDto,
    telegramUserId: string,
    eventId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramUserId,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    const feedback = await this.prisma.feedback.create({
      data: {
        rating: dto.rating,
        comment: dto.comment ? dto.comment : null,
        user: {
          connect: {
            id: user.id,
          },
        },
        event: {
          connect: {
            id: event.id,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        rating: true,
        comment: true,
        eventId: true,
        userId: true,
      },
    });

    return feedback;
  }
}
