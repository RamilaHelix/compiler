import { Controller } from '@nestjs/common';
import { CompilerService } from './compiler.service';

@Controller('compiler')
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) { }
}
