import { Test } from '@nestjs/testing';

import { EventRewardsService } from '../event-rewards/event-rewards.service';
import { MembersService } from '../members/members.service';
import { PlayerService } from '../player/player.service';
import { PlayerCountService } from '../player-count/player-count.service';
import { PlayerPropertyService } from '../player-property/player-property.service';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: PlayerService,
          useValue: {
            createNewPlayer: jest.fn(),
            upsertMemberPoint: jest.fn(),
            updateLastMatchTime: jest.fn(),
            upsertAddPoint: jest.fn(),
          },
        },
        {
          provide: MembersService,
          useValue: {},
        },
        {
          provide: PlayerCountService,
          useValue: {},
        },
        {
          provide: EventRewardsService,
          useValue: {},
        },
        {
          provide: PlayerPropertyService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<GameService>(GameService);
  });
  describe('giveEventPoints', () => {
    it('活动期间内', async () => {
      const startTime = new Date('2021-01-01 00:00:00');
      const endTime = new Date('2025-01-01 00:00:00');
      const seasonPoints = 100;
      const player = {
        id: '1',
        matchCount: 0,
        winCount: 0,
        disconnectCount: 0,
        seasonPointTotal: 0,
        memberPointTotal: 0,
        lastMatchTime: null,
        conductPoint: 100,
      };

      const result = service.giveEventPoints(
        startTime,
        endTime,
        seasonPoints,
        player,
      );

      expect(result).toBe(100);
    });
  });
});
