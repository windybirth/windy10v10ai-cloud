import { Collection } from 'fireorm';

import { UpdatePlayerCountDto } from '../dto/player-count.dto';

@Collection()
export class PlayerCount {
  id: string; // YYYYMMDD
  playerCount: Count;
  memberCount: Count;

  init(id: string) {
    this.id = id;
    this.playerCount = this.buildCount();
    this.memberCount = this.buildCount();
    return this;
  }
  addPlayerCount(countDto: UpdatePlayerCountDto) {
    const { countryCode, playerIds, memberIds } = countDto;

    const playerCount = playerIds.length;
    this.playerCount.count += playerCount;
    this.playerCount.playerNumber[`p${playerCount}`] += playerCount;
    if (!this.playerCount.countryCode[countryCode]) {
      this.playerCount.countryCode[countryCode] = 0;
    }
    this.playerCount.countryCode[countryCode] += playerCount;

    const memberCount = memberIds.length;
    this.memberCount.count += memberCount;
    this.memberCount.playerNumber[`p${playerCount}`] += memberCount;
    if (!this.memberCount.countryCode[countryCode]) {
      this.memberCount.countryCode[countryCode] = 0;
    }
    this.memberCount.countryCode[countryCode] += memberCount;
  }

  private buildCount() {
    return {
      count: 0,
      countryCode: {
        CN: 0,
        HK: 0,
        US: 0,
      },
      playerNumber: {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
        p5: 0,
        p6: 0,
        p7: 0,
        p8: 0,
        p9: 0,
        p10: 0,
      },
    };
  }
}

export class Count {
  count: number;
  countryCode: CountryCode;
  playerNumber: PlayerNumber;
}

export class CountryCode {
  CN: number;
  HK: number;
  US: number;
}

export class PlayerNumber {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;
  p7: number;
  p8: number;
  p9: number;
  p10: number;
}
