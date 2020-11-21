import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';
import { Document } from 'mongodb';

export function requestBodyValidator<T>(requestClass: ClassType<T>) {
  return (request, response, next) => {
    if (!['POST', 'PUT'].includes(request.method.toUpperCase())) {
      return next();
    }
    const parsedObj = plainToClass(requestClass, request.body, { excludeExtraneousValues: true });
    request.body = parsedObj;
    validate(parsedObj).then(errors => {
      if (errors.length > 0) {
        return next(errors.map(error => JSON.stringify(error.constraints)));
      }
    })
      .finally(next);
  }
}

export function convertToClass<T>(json: any, classType: ClassType<T>) {
  const parsedObj = plainToClass(classType, json, { excludeExtraneousValues: true });
  validate(parsedObj).then(errors => {
    if (errors.length > 0) {
      throw new Error(errors.map(error => JSON.stringify(error.constraints)).toString());
    }
  });
  return parsedObj;
}

