import { Injectable, NotFoundException } from '@nestjs/common';
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
}
