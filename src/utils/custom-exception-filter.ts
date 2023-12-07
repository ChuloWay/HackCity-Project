import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Something Went Wrong';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorMessage = exception.message || 'Unhandled Exception';
    } else {
      console.error(exception);
    }

    function hasNameAndStack(exception: unknown): exception is Error {
      return typeof exception === 'object' && 'name' in exception && 'stack' in exception;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error: hasNameAndStack(exception)
        ? {
            name: exception.name,
            message: errorMessage,
            stack: exception.stack,
          }
        : {
            message: exception,
          },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
