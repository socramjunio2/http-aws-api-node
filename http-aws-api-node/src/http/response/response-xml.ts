import { getStatusText } from "http-status-codes";
import { Response } from "../..";
import { EntityError } from "./entity-error";

export class ResponseXml<T> {
  public attributeId = "c1b57dce-3529-4c7e-8142-6ffaf627c222";
  constructor(
    public status?: number,
    public entity?: string,
  ) { }
}

export class ResponseXmlCreator {
  public static success<T>(status: number, xml: string): ResponseXml<T> {
    return new ResponseXml(status, xml);
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
}
