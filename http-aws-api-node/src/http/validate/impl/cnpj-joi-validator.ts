import { CustomHelpers, Extension } from "@hapi/joi";
import { cnpjValidator } from "../../..";
import { IGeneric } from "./i-generic";

export function cnpjJoiValidator(joi: IGeneric): Extension {
    return {
        base: joi.string(),
        coerce(value: any, helpers: CustomHelpers) {
            if (value) {
                return {
                    value: `${value}`.replace(/\D+/g, ""),
                };
            }
            return { value };
        },
        messages: {
            "string.cnpj": "{{#label}} Número de CNPJ inválido.",
        },
        type: "cnpj",
        validate(value: any, helpers: CustomHelpers) {
            if (!cnpjValidator.isValid(value)) {
                return {
                    errors: helpers.error("string.cnpj"),
                    value,
                };
            }
        },
    };
}
