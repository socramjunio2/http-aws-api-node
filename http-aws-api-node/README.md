# HTTP AWS

Simple module to use a basic API Gateway format + got as request handler.

## Importing the project
```
npm login --registry=https://npm.pkg.github.com --scope=@nome-da-organizacao
npm install @nome-da-organizacao/http-aws-api-node
```

## Using the API

```
const execute: APIGatewayProxyHandler = async (event, _context, _cb) => {
  try {
    const profession = cast(event.body, Profession);
    return onSuccess(new AppResponse(profession, OK));        
  } catch(e) {
    return onError(e);
  }
};
```

## Calling an API

```
const req = request();
req.post('http://google.com', {
  json: true,
  body: {
    data: 'some-data'
  }
});
```
