import Joi = require("@hapi/joi");
import { Authentication } from "./http/authentication";
import {
  callback, callbackXml, Content, ContentXml, convert, Endpoint, EndpointXml, execute, executeXml, failure, getDirname,
  getSqsAttribute, logar, SqsOrHttpEvent, treated, validate, validateList,
} from "./http/http-lambda";
import { request } from "./http/http-request";
import {dateDeserializer, dateSerializer} from "./http/json/serializers/date-transformer";
import { DateDeserializer } from "./http/json/serializers/impl/date-deserializer";
import { DateSerializer } from "./http/json/serializers/impl/date-serializer";
import { Entity } from "./http/response/entity";
import { EntityError, EntityErrorCreator } from "./http/response/entity-error";
import { EntityResult, EntityResultCreator } from "./http/response/entity-result";
import { messagesPtBr } from "./http/response/messages-pt-br";
import { Response, ResponseCreator } from "./http/response/response";
import { ResponseXml, ResponseXmlCreator } from "./http/response/response-xml";
import { cnpjJoiValidator } from "./http/validate/impl/cnpj-joi-validator";
import { CNPJValidator } from "./http/validate/impl/cnpj-validator";
import { cpfJoiValidator } from "./http/validate/impl/cpf-joi-validator";
import { CPFValidator } from "./http/validate/impl/cpf-validator";
import { DateValidator } from "./http/validate/impl/date-validator";
import { QueryValidator } from "./http/validate/impl/query-validator";

export const cpfValidator = new CPFValidator();
export const joiEpy = Joi.extend(cpfJoiValidator)
                            .extend(cnpjJoiValidator);
export const cnpjValidator = new CNPJValidator();
export const dateValidator = new DateValidator();
export const queryValidator = new QueryValidator();

export {
  Authentication, callback, callbackXml, failure, request, treated, validate, convert, Endpoint, EndpointXml,
  execute, executeXml, logar, getSqsAttribute, getDirname, Content, ContentXml, SqsOrHttpEvent, Response, ResponseXml,
  Entity, EntityError, EntityErrorCreator, EntityResult, EntityResultCreator, ResponseCreator, ResponseXmlCreator,
  DateSerializer, DateDeserializer, dateSerializer, dateDeserializer, messagesPtBr, validateList,
};
