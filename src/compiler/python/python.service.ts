import { Injectable } from '@nestjs/common';

@Injectable()
export class PythonService {
  run(runPythonDto: any) {
    return runPythonDto;
  }
}
