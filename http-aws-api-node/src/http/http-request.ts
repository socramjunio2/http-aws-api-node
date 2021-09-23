import got = require("got");

const ID_LENGTH = 36;
const ID_START = 2;
const ID_END = 15;
const BODY_SIZE_LIMIT = 2000;

function httpContextId(): string {
    return Math.random()
      .toString(ID_LENGTH)
      .substring(ID_START, ID_END) + Math.random()
      .toString(ID_LENGTH)
      .substring(ID_START, ID_END);
}

function getLoggable(raw: any, keys: string[]): any {
  const data: any = keys.reduce((source, key) => ({
    ...source, [key]: raw[key],
  }), {});
  const body = data.body;
  if (body) {
    if (typeof body === "string") {
      if (body.length > BODY_SIZE_LIMIT) {
        data.body = body.substring(0, BODY_SIZE_LIMIT);
      }
    } else {
      data.body = "<<<<Binary>>>>";
    }
  }
  return data;
}

function beforeRequest(): Array<got.BeforeRequestHook<got.GotBodyOptions<string>>> {
  return [
    (options) => {
      const raw = options as any;
      raw.httpContextId = httpContextId();
      const data = getLoggable(raw, [
        "httpContextId",
        "method",
        "protocol",
        "hostname",
        "path",
        "query",
        "headers",
        "body",
      ]);
      process.stdout.write(`${JSON.stringify(data)}\n`);
    },
  ];
}

function afterRequest(): Array<got.AfterResponseHook<got.GotBodyOptions<string>, string>> {
  return [
    (raw, _) => {
      const data = getLoggable(raw, [
        "statusCode",
        "headers",
        "body",
      ]);
      data.httpContextId = (raw as any).request.gotOptions.httpContextId;
      process.stdout.write(`${JSON.stringify(data)}\n`);
      return raw;
    },
  ];
}

export function request(): got.GotInstance<got.GotJSONFn> {
  return got.extend({
    hooks: {
      afterResponse: afterRequest(),
      beforeRequest: beforeRequest(),
    },
  });
}
