import { Test } from '@nestjs/testing';
import { getRepositoryToken } from 'nestjs-fireorm';

import { Player } from './entities/player.entity';
import { PlayerService } from './player.service';

describe('CatsController', () => {
  let playerService: PlayerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      //   imports: [FireormModule.forFeature([Player])],
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {},
        },
      ],
    }).compile();

    playerService = moduleRef.get<PlayerService>(PlayerService);
  });
  describe('赛季积分', () => {
    describe('升级所需积分', () => {
      let level = 1;
      let point = 500;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonNextLevelPoint(level);
        expect(result).toBe(point);
      });

      level = 2;
      point = 600;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonNextLevelPoint(level);
        expect(result).toBe(point);
      });

      level = 10;
      point = 1400;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonNextLevelPoint(level);
        expect(result).toBe(point);
      });
      level = 20;
      point = 2400;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonNextLevelPoint(level);
        expect(result).toBe(point);
      });
      level = 50;
      point = 5400;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonNextLevelPoint(level);
        expect(result).toBe(point);
      });
    });
    describe('等级所需累计积分', () => {
      let level = 1;
      let point = 500;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonTotalPoint(level);
        expect(result).toBe(point);
      });

      level = 2;
      point = 1100;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonTotalPoint(level);
        expect(result).toBe(point);
      });

      level = 10;
      point = 9500;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonTotalPoint(level);
        expect(result).toBe(point);
      });
      level = 20;
      point = 29000;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonTotalPoint(level);
        expect(result).toBe(point);
      });
      level = 50;
      point = 147500;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getSeasonTotalPoint(level);
        expect(result).toBe(point);
      });
    });

    describe('根据积分获取当前等级', () => {
      let point = 0;
      let level = 0;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });

      point = 499;
      level = 0;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 500;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 600;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 1099;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 1100;
      level = 2;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 28999;
      level = 19;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 29000;
      level = 20;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 147500;
      level = 50;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getSeasonLevelBuyPoint(point);
        expect(result).toBe(level);
      });
    });
  });

  describe('会员积分', () => {
    describe('升级所需积分', () => {
      let level = 0;
      let point = 0;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberNextLevelPoint(level);
        expect(result).toBe(point);
      });

      level = 1;
      point = 1000;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberNextLevelPoint(level);
        expect(result).toBe(point);
      });

      level = 2;
      point = 1050;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberNextLevelPoint(level);
        expect(result).toBe(point);
      });
      level = 20;
      point = 1950;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberNextLevelPoint(level);
        expect(result).toBe(point);
      });
      level = 50;
      point = 3450;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberNextLevelPoint(level);
        expect(result).toBe(point);
      });
    });

    describe('等级所需累计积分', () => {
      let level = 0;
      let point = 0;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberTotalPoint(level);
        expect(result).toBe(point);
      });

      level = 1;
      point = 1000;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberTotalPoint(level);
        expect(result).toBe(point);
      });

      level = 2;
      point = 2050;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberTotalPoint(level);
        expect(result).toBe(point);
      });
      level = 20;
      point = 29500;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberTotalPoint(level);
        expect(result).toBe(point);
      });
      level = 50;
      point = 111250;
      it(`${level} -> ${point}`, async () => {
        const result = playerService.getMemberTotalPoint(level);
        expect(result).toBe(point);
      });
    });

    describe('根据积分获取当前等级', () => {
      let point = 0;
      let level = 0;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });

      point = 999;
      level = 0;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 1000;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 1001;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 2049;
      level = 1;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 2050;
      level = 2;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 29500;
      level = 20;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
      point = 111250;
      level = 50;
      it(`${point} -> ${level}`, async () => {
        const result = playerService.getMemberLevelBuyPoint(point);
        expect(result).toBe(level);
      });
    });
  });
});
