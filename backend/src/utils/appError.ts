import { HTTPSTATUS, type HttpStatusCodeType } from "../configs/http.config.js";
import {
  ErrorCodeEnum,
  type ErrorCodeEnumType,
} from "../enums/errorCode.enum.js";

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode: ErrorCodeEnumType | undefined;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message, statusCode, errorCode);
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.INTERNAL_SERVER_ERROR
  ) {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode);
  }
}

export class NotFoundException extends AppError {
  constructor(
    message = "Resource not found",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.RESOURCE_NOT_FOUND
  ) {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode);
  }
}

export class BadRequestException extends AppError {
  constructor(
    message = "Bad Request",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.VALIDATION_ERROR
  ) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends AppError {
  constructor(
    message = "Unauthorized Access",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.ACCESS_UNAUTHORIZED
  ) {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode);
  }
}
