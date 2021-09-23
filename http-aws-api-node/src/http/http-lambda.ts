import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler, SQSEvent } from "aws-lambda";
import { Return } from "aws-sdk/clients/cloudsearchdomain";
import { MessageBodyAttributeMap } from "aws-sdk/clients/sqs";
import { ObjectSchema } from "hapi__joi";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } from "http-status-codes";
import { inspect, isPrimitive } from "util";
import * as xml2js from "xml2js";
import { EntityErrorCreator } from "..";
import { ERR_REQUIRED_MSG, ERR_UNKNOWN, ERR_UNKNOWN_MSG } from "./response/error-codes";
import { Response, ResponseCreator } from "./response/response";
import { ResponseXml } from "./response/response-xml";

// tslint:disable
const { error, errorValidate } = ResponseCreator;

const {
  ALLOW_ORIGIN, ALLOW_METHODS, ALLOW_HEADERS, ALLOW_CREDENTIALS,
} = process.env;

const baseHeaders = (headers: {} = {}) => {
  return {
    "Access-Control-Allow-Credentials": ALLOW_CREDENTIALS === null || ALLOW_CREDENTIALS === undefined ? true : false,
    "Access-Control-Allow-Headers": ALLOW_HEADERS || "*",
    "Access-Control-Allow-Methods": ALLOW_METHODS || "*",
    "Access-Control-Allow-Origin": ALLOW_ORIGIN || "*",
    "Content-Type": "application/json",
    ...headers,
  };
};

const baseHeadersXml = (headers: {} = {}) => {
  return {
    "Access-Control-Allow-Credentials": ALLOW_CREDENTIALS === null || ALLOW_CREDENTIALS === undefined ? true : false,
    "Access-Control-Allow-Headers": ALLOW_HEADERS || "*",
    "Access-Control-Allow-Methods": ALLOW_METHODS || "*",
    "Access-Control-Allow-Origin": ALLOW_ORIGIN || "*",
    "Content-Type": "application/xml",
    ...headers,
  };
};

export function treated(exception: any): Response<any> {
  process.stderr.write(`Failure: ${exception}`);
  const status = exception.statusCode
    ? exception.statusCode
    : INTERNAL_SERVER_ERROR;
  return error(status, ERR_UNKNOWN_MSG, [{
    code: ERR_UNKNOWN,
    message: exception.message,
  }]);
}

export function validate<T>(data: T, schema: ObjectSchema): T {
  const result = schema.validate(data, { abortEarly: false });
  if (result.error) {
    throw errorValidate(BAD_REQUEST,
      EntityErrorCreator.allOf(result.error.details),
    );
  }
  return data;
}

export function validateList<T>(data: T, schema: ObjectSchema): T {
  const result = schema.validate(data, { abortEarly: false });
  if (result.error) {
    throw errorValidate(PRECONDITION_FAILED,
      EntityErrorCreator.allOf(result.error.details),
    );
  }
  return data;
}

export type SqsOrHttpEvent = APIGatewayProxyEvent & SQSEvent;

export function convert<T>(event: SqsOrHttpEvent, type: new () => T, useStripNS?: boolean): T {
  const target = new type();
  const body = event.Records && event.Records.length
    ? event.Records[0].body
    : event.body;

  if (event.headers && event.headers['Content-Type'] === 'application/xml') {
    const optionsXml = useStripNS ? { trim: true, explicitArray: false, ignoreAttrs: true, tagNameProcessors: [xml2js.processors.stripPrefix] }
      : { trim: true, explicitArray: false, ignoreAttrs: true };
    xml2js.parseString(body, optionsXml,
      function (err, result) { Object.assign(target, result); });

  } else {
    Object.assign(target, JSON.parse(body));
    Object.keys(target)
      .forEach((key) => target[key] === undefined && delete target[key]);
  }

  return target;
}

export type ContentXml<Return> = Promise<ResponseXml<Return>>;
export type EndpointXml<Event = any, ReturnXml = any> = (
  event: Event,
  context: Context,
  callback: Callback<Return>,
) => ContentXml<Return>;

export function executeXml(endpoint: EndpointXml): Handler {
  return async (event, context, cb) => {
    try {      
      setAwsRequestId(context);
      const result = await endpoint(event, context, cb);
      return callbackXml(result);
    } catch (e) {
      return failure(e);
    }
  };
}

export function callbackXml<T>(response: ResponseXml<T>): APIGatewayProxyResult {
  return {
    body: response.entity,
    headers: baseHeadersXml(),
    statusCode: response.status,
  };
}

export type Content<Return> = Promise<Response<Return>>;

export type Endpoint<Event = any, Return = any> = (
  event: Event,
  context: Context,
  callback: Callback<Return>,
) => Content<Return>;

let awsRequestId;

export function logar(...argumentos: any[]) {
  const args: any[] = argumentos;
  process.stdout.write(`[${awsRequestId}] ${args.map(arg => { return isPrimitive(arg) ? String(arg) : inspect(arg) }).join(' ')}\n`)
}

export function execute(endpoint: Endpoint): Handler {
  return async (event, context, cb) => {
    try {
      setAwsRequestId(context);
      const result = await endpoint(event, context, cb);
      return callback(result);
    } catch (e) {
      return failure(e);
    }
  };
}

function setAwsRequestId(context) {
  awsRequestId = context
    ? context.awsRequestId
    : `awsRequestId_${Math.floor(Math.random() * 10000000)}`;
}

export function callback<T>(response: Response<T>): APIGatewayProxyResult {
  return {
    body: JSON.stringify(response.entity),
    headers: baseHeaders(),
    statusCode: response.status,
  };
}

export function failure<T>(response: any): APIGatewayProxyResult {
  if (response && isResponse(response)) {
    return callback(response);
  }
  return callback(error(INTERNAL_SERVER_ERROR, ERR_UNKNOWN_MSG, [{
    code: ERR_UNKNOWN,
    message: response.message
      ? response.message
      : ERR_REQUIRED_MSG,
  }]));
}

export function isResponse<T>(response: Response<T>): response is Response<T> {
  return response.attributeId !== undefined;
}

export function getSqsAttribute(event: SqsOrHttpEvent, attrKey: string): string {
  if (event.Records) {
    const record = event.Records[0];
    if (record && record.messageAttributes) {
      const attributes = record.messageAttributes as any as MessageBodyAttributeMap;
      const attrVal = attributes[attrKey] as any;
      return attrVal ? (attrVal.stringValue || attrVal.StringValue) : undefined;
    }
  }
}

export function getDirname(): string {
  const { LAMBDA_TASK_ROOT } = process.env;
  return LAMBDA_TASK_ROOT
    ? `${LAMBDA_TASK_ROOT}`
    : `${__dirname.split("/node_modules/")[0]}`;
}

// tslint:enable
