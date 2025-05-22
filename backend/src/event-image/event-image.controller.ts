import { Controller } from '@nestjs/common';
import { EventImageService } from './event-image.service';

@Controller('event-image')
export class EventImageController {
  constructor(private readonly eventImageService: EventImageService) {}
}
