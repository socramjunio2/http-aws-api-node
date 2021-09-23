import { getStatusText } from "http-status-codes";
import { Entity } from "./entity";
import { EntityError } from "./entity-error";

export class Response<T> {
  public attributeId = "c1b57dce-3529-4c7e-8142-6ffaf627c222";
  constructor(
    public status?: number,
    public entity?: Entity<T>,
  ) { }
}

export class ResponseCreator {
  public static success<T>(status: number, message: string, data: T): Response<T> {
    return new Response(status, {
      data: data ? data : undefined,
      result: {
        code: `${status}`,
        info: getStatusText(status),
        message: message ? message : undefined,
      },
    });
  }

  public static error<T>(status: number, message: string, errors: EntityError[]): Response<T> {
    return new Response(status, {
      errors: errors && errors.length ? errors : undefined,
      result: {
        code: `${status}`,
        info: getStatusText(status),
        message: message ? message : undefined,
      },
    });
  }

  public static errorValidate<T>(status: number, errors: EntityError[]): Response<T> {
    return new Response(status, {
      errors: errors && errors.length ? errors : undefined,
      result: {
        code: `${status}`,
        info: getStatusText(status),
      },
    });
  }
}
