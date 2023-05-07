import { HttpException, HttpStatus } from '@nestjs/common';

export const errorMessage = (status: string, message: string) => {
  throw new HttpException(
    {
      status: HttpStatus[status],
      error: message,
    },
    HttpStatus[status],
  );
};
