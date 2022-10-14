import { Collection } from 'fireorm';

@Collection()
export class GamePlayerCount {
  id: string; // playerYYYYMMDD or memberYYYYMMDD
  count: number;
  isServer: number;
  countryCode: CountryCode;
  playerNumber: PlayerNumber;

  init(id: string) {
    this.count = 0;
    this.isServer = 0;
    this.countryCode.CN = 0;
    this.countryCode.HK = 0;
    this.countryCode.US = 0;
    this.countryCode.Other = 0;
    this.playerNumber.p1 = 0;
    this.playerNumber.p2 = 0;
    this.playerNumber.p3 = 0;
    this.playerNumber.p4 = 0;
    this.playerNumber.p5 = 0;
    this.playerNumber.p6 = 0;
    this.playerNumber.p7 = 0;
    this.playerNumber.p8 = 0;
    this.playerNumber.p9 = 0;
    this.playerNumber.p10 = 0;
  }
}

export class CountryCode {
  CN: number;
  HK: number;
  US: number;
  Other: number;
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
