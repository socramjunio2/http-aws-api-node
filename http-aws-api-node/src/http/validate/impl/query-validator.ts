import { PRECONDITION_FAILED } from "http-status-codes";
import { dateValidator, EntityError, EntityErrorCreator, ResponseCreator, SqsOrHttpEvent } from "../../..";
import {
    ATRIBUTO_INVALIDO,
    ATRIBUTO_INVALIDO_MSG,
    ATRIBUTO_REQUERIDO,
    ATRIBUTO_REQUERIDO_MSG,
    VALOR_ATRIBUTO_INVALIDO,
    VALOR_ATRIBUTO_INVALIDO_MSG,
    VALOR_ATRIBUTO_INVALIDO_MSG_2,
} from "../../response/error-codes";
import { CNPJValidator } from "./cnpj-validator";
import { CPFValidator } from "./cpf-validator";

const { errorValidate } = ResponseCreator;

export class QueryValidator {

    public validParams(event: SqsOrHttpEvent, validParams: any): void {
        const hasInvalidParams = this.hasInvalidParams(event, validParams);
        if (hasInvalidParams && hasInvalidParams.length > 0) {
            throw errorValidate(PRECONDITION_FAILED,
                EntityErrorCreator.allOfQuery(hasInvalidParams, ATRIBUTO_INVALIDO, ATRIBUTO_INVALIDO_MSG));
        }
        const hasInvalidValue = this.hasInvalidValueParams(event, validParams);
        if (hasInvalidValue && hasInvalidValue.length > 0) {
            throw errorValidate(PRECONDITION_FAILED,
                EntityErrorCreator.allOfQuery(hasInvalidValue, VALOR_ATRIBUTO_INVALIDO, VALOR_ATRIBUTO_INVALIDO_MSG));
        }
        const missingRequiredParams = this.missingRequiredParams(event, validParams);
        if (missingRequiredParams && missingRequiredParams.length > 0) {
            throw errorValidate(PRECONDITION_FAILED,
                EntityErrorCreator.allOfQuery(missingRequiredParams, ATRIBUTO_REQUERIDO, ATRIBUTO_REQUERIDO_MSG));
        }

    }

    private hasInvalidParams(event: SqsOrHttpEvent, validParams: any): any {
        if (event.queryStringParameters) {
            const validParamsKey = Object.keys(validParams);
            const fields = Object.keys(event.queryStringParameters);
            const invalidParams = fields.filter((field) => validParamsKey.indexOf(field) === -1);
            return invalidParams;
        } else {
            return false;
        }
    }

    private hasInvalidValueParams(event: SqsOrHttpEvent, validParams: any): any {
        if (event.multiValueQueryStringParameters) {
            const parameters = event.multiValueQueryStringParameters;
            const fields = Object.keys(parameters);

            const invalidParams = fields.filter((field) => {
                const valuesParam = parameters[field];
                const validTypeForParam = validParams[field].type;
                const validPatternForParam = validParams[field].pattern;

                const hasInvalidValue = !valuesParam.every((value) =>
                    this.validateType(value, validTypeForParam, validPatternForParam));

                if (!hasInvalidValue && validParams[field].values) {
                    const result = !valuesParam.every((element) => validParams[field].values.includes(element));
                    if (result) {
                        const msg = VALOR_ATRIBUTO_INVALIDO_MSG_2.replace("%field%", field)
                            .replace("%validValues%", validParams[field].values.toString());

                        throw errorValidate(PRECONDITION_FAILED,
                            [new EntityError(VALOR_ATRIBUTO_INVALIDO, msg, field)]);
                    }
                }
                return hasInvalidValue;
            });
            return invalidParams;

        } else if (event.queryStringParameters) {
            const parameters = event.queryStringParameters;
            const fields = Object.keys(parameters);
            const invalidParams = fields.filter((field) => {
                const value = parameters[field];
                const validTypeForParam = validParams[field].type;
                const validPatternForParam = validParams[field].pattern;
                const hasInvalidValue = !this.validateType(value, validTypeForParam, validPatternForParam);
                if (!hasInvalidValue && validParams[field].values) {
                    const result = !validParams[field].values.includes(value);
                    if (result) {
                        const msg = VALOR_ATRIBUTO_INVALIDO_MSG_2.replace("%field%", field)
                            .replace("%validValues%", validParams[field].values.toString());

                        throw errorValidate(PRECONDITION_FAILED,
                            [new EntityError(VALOR_ATRIBUTO_INVALIDO, msg, field)]);
                    }
                }
                return hasInvalidValue;
            });
            return invalidParams;

        } else {
            return false;
        }
    }

    private validateType(value: string | number, type: any, pattern: string): boolean {
        if (!value) {
            return false;
        }
        switch (type) {
            case "string":
                return typeof value === "string";
            case "number":
                return !isNaN(Number(value));
            case "cpf":
                const cpfValidator = new CPFValidator();
                return cpfValidator.isValid(value.toString());
            case "cnpj":
                const cnpjValidator = new CNPJValidator();
                return cnpjValidator.isValid(value.toString());
            case "date":
                return dateValidator.isValidDate(value.toString(), pattern);
            default:
                return false;
        }
    }

    private missingRequiredParams(event: SqsOrHttpEvent, validParams: any): any {
        const requiredParams = Object.keys(validParams).filter((param) => validParams[param].required);
        if (requiredParams && requiredParams.length > 0) {
            if (event.queryStringParameters == null) {
                return requiredParams;
            }
            const queryFields = Object.keys(event.queryStringParameters);
            const missingRequiredParams = requiredParams.filter((field) => queryFields.indexOf(field) === -1);
            return missingRequiredParams;
        }
        return false;
    }

}
