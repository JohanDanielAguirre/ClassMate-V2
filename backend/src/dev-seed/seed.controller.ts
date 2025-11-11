import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private service: SeedService) {}

  @Post('run')
  async run() {
    return this.service.run();
  }
}
