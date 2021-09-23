import { CustomHelpers, Extension } from "@hapi/joi";
import { cpfValidator } from "../../..";
import { IGeneric } from "./i-generic";

export function cpfJoiValidator(joi: IGeneric): Extension {
    return {
        base: joi.string(),
        coerce(value: any, helpers: CustomHelpers) {
            if (value) {
                return {
                    value: `${value}`.replace(/\D+/g, " "),
                };
            }
            return { value };
        },
        messages: {
            "string.cpf": "Número de CPF inválido.",
        },
        type: "cpf",
        validate(value: any, helpers: CustomHelpers) {
            if (!cpfValidator.isValid(value)) {
                return {
                    errors: helpers.error("string.cpf"),
                    value,
                };
            }
        },
    };
}
