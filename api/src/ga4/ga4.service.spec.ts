import { Test, TestingModule } from '@nestjs/testing';
import { Ga4Service } from './ga4.service';

describe('Ga4Service', () => {
  let service: Ga4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Ga4Service],
    }).compile();

    service = module.get<Ga4Service>(Ga4Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
