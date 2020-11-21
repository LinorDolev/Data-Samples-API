import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';

export default function requestBodyValidator<T>(requestClass: ClassType<T>) {
  return (request, response, next) => {
    if (!['POST', 'PUT'].includes(request.method.toUpperCase())) {
      return next();
    }
    const dataSample = plainToClass(requestClass, request.body, { excludeExtraneousValues: true });
    request.body = dataSample;
    validate(dataSample).then(errors => {
      if (errors.length > 0) {
        return next(errors.map(error => JSON.stringify(error.constraints)));
      }
    })
      .finally(next);
  }
}