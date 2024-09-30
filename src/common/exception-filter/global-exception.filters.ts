import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllRpcExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const rpcContext = host.switchToRpc();
    const rpcData = rpcContext.getData();

    const errorResponse = {
      status: false,
      message: this.getErrorMessage(exception),
      rpcData,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`RPC Error: ${exception.message}`, exception.stack);

    if (exception instanceof RpcException) {
      return errorResponse;
    } else {
      return {
        status: false,
        message: 'Internal server error in RPC handler',
        rpcData,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof RpcException) {
      return exception.message || 'RPC exception occurred';
    } else if (exception instanceof Error) {
      return exception.message || 'Internal server error';
    } else {
      return 'Unknown RPC error occurred';
    }
  }
}
