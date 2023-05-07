import { Controller, Post, Body, UseInterceptors, Req } from '@nestjs/common';
import { PythonService } from './python.service';
import { PythonCompilerInterceptor } from 'src/helpers/python-compiler.interceptor';
import { CompileProgramDto } from '../dto/run-compiler.dto';

@Controller('compiler/python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) { }


  @UseInterceptors(PythonCompilerInterceptor)
  @Post()
  run(@Body() runNodeDto: CompileProgramDto, @Req() req) {
    return this.pythonService.run({ ...runNodeDto, ...req.body });
  }
}
