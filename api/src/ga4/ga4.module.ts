import { Module } from '@nestjs/common';

import { Ga4Controller } from './ga4.controller';
import { Ga4Service } from './ga4.service';

@Module({
  controllers: [Ga4Controller],
  providers: [Ga4Service],
})
export class Ga4Module {}
