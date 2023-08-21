import { Test } from '@nestjs/testing';

import { GameService } from './game.service';

describe('CatsController', () => {
  let service: GameService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = moduleRef.get<GameService>(GameService);
  });
  describe('giveEventPoints', () => {
    it('活动期间内', async () => {
      const startTime = new Date('2021-01-01 00:00:00');
      const endTime = new Date('2025-01-01 00:00:00');
      const seasonPoints = 100;
      const steamIds = [1, 2, 3, 4, 5];

      const result = await service.giveEventPoints(
        startTime,
        endTime,
        seasonPoints,
        steamIds,
      );

      expect(result).toBe(true);
    });

    it('活动开始前', async () => {
      const startTime = new Date('2025-01-01 00:00:00');
      const endTime = new Date('2025-01-01 00:00:00');
      const seasonPoints = 100;
      const steamIds = [1, 2, 3, 4, 5];

      const result = await service.giveEventPoints(
        startTime,
        endTime,
        seasonPoints,
        steamIds,
      );

      expect(result).toBe(false);
    });

    it('活动结束后', async () => {
      const startTime = new Date('2021-01-01 00:00:00');
      const endTime = new Date('2021-01-01 00:00:00');
      const seasonPoints = 100;
      const steamIds = [1, 2, 3, 4, 5];

      const result = await service.giveEventPoints(
        startTime,
        endTime,
        seasonPoints,
        steamIds,
      );

      expect(result).toBe(false);
    });
  });
});
