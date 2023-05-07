import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { map, Observable } from 'rxjs';
import { spawnSync } from 'child_process';
import { errorMessage } from 'src/error';
import { v4 as v4uuid } from 'uuid';

@Injectable()
export class PythonCompilerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();

    try {
      var dir = path.join(__dirname, '..', 'scripts');
      if (!existsSync(dir)) {
        mkdirSync(dir);
      }

      var fileName = path.join(dir, `${v4uuid()}.py`)

      writeFileSync(fileName, request.body?.script)
      const scriptExecution = spawnSync('python', [fileName], {
        input: request.body?.input,
        timeout: 3000
      })
      if (scriptExecution.status === 0) {
        return next.handle().pipe(map(flow => flow.data = { message: scriptExecution.stdout.toString().trim() }))
      } else {
        return next.handle().pipe(map(flow => flow.data = errorMessage('SYNTAX_ERROR', scriptExecution.stderr.toString().trim())))
      }
    } catch (error) {

      return next.handle().pipe(map(flow => flow.data = errorMessage('INTERNAL_SERVER_ERROR', `${error}`)));
    }
  }
}
