import { Controller } from '@nestjs/common';

import { EventRewardsService } from './event-rewards.service';

@Controller('event-rewards')
export class EventRewardsController {
  constructor(private readonly eventRewardsService: EventRewardsService) {}
}
