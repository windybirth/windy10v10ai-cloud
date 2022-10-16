import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  getOK(): string {
    return 'OK';
  }
}
