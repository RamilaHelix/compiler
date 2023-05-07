import { Module } from '@nestjs/common';
import { CompilerService } from './compiler.service';
import { CompilerController } from './compiler.controller';
import { PythonModule } from './python/python.module';

@Module({
  controllers: [CompilerController],
  providers: [CompilerService],
  imports: [PythonModule]
})
export class CompilerModule { }
