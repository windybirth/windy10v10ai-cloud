import { Global, Module } from '@nestjs/common';

import { SecretService } from './secret.service';

@Global()
@Module({
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
