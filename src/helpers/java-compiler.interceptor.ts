import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { map, Observable } from 'rxjs';
import { execSync, spawnSync } from 'child_process';
import { v4 as v4uuid } from 'uuid'
import { errorMessage } from 'src/error';

@Injectable()
export class JavaCompilerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();
    try {
      var className = request.body?.script.slice(request.body?.script.indexOf("class") + 5, request.body?.script.indexOf("{")).trim()
      var dir1 = path.join(__dirname, '..', 'scripts');
      var uusidString = v4uuid()
      var dir = path.join(__dirname, '..', 'scripts', uusidString.slice(0, uusidString.indexOf("-")));
      if (!existsSync(dir1)) {
        mkdirSync(dir1);
        mkdirSync(dir);
      }
      else {
        mkdirSync(dir);
      }
      var fileName = path.join(dir, className)
      writeFileSync(`${fileName}.java`, request.body?.script)
      writeFileSync(`${fileName}.txt`, request.body?.input)
      execSync(`javac ${fileName}.java`)
      let scriptExecution = execSync(`java -classpath ${dir} ${className} <${fileName}.txt`)
      return next.handle().pipe(map(flow => flow.data = { output: scriptExecution.toString().trim() }))

    } catch (error) {
      return next.handle().pipe(map(flow => flow.data = errorMessage('INTERNAL_SERVER_ERROR', `${error}`)));
    }
  }
}
