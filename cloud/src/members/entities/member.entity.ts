export class Member {
  steamId!: number;
  expireDate!: Date;
  /**
   * @param {number} steamId
   * @param {Date} expireDate
   */
  constructor(steamId: number, expireDate?: Date) {
    this.steamId = steamId;
    // if expireDate is not specified, set it to the default value
    this.expireDate = expireDate || new Date('2099-12-31T00:00:00Z');
  }
}
