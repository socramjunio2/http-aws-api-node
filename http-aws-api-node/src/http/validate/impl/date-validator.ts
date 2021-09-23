import * as BaseJoi from "@hapi/joi";
import { IValidate } from "../validate";

/**
 * Classe que disponibiliza funcoes de validacao para campos do tipo data
 * @version 1.0
 * @since 02/04/2020
 * @author Eduardo Giovany Schweigert
 */
export class DateValidator {

    private joi = require("@hapi/joi")
        .extend(require("@hapi/joi-date"));

    /**
     * Valida uma data dado uma mascara
     * @param data string a ser validada
     * @param pattern mascara a ser aplicada
     * @returns true/false
     */
    public isValidDate(data: string, pattern: string): boolean {
        const schema = this.joi.date().format(pattern);

        try {
            if (!this.joi.attempt(data, schema)) {
                return false;
            }
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Valida se um range de datas é válido: @dataInicial <= @dataFinal
     * @param dataInicial string representando a data inicial a ser validada
     * @param dataFinal string representando a data final a ser validada
     * @param pattern mascara a ser aplicada
     * @returns true/false
     */
    public isValidRange(dataInicial: string, dataFinal: string, pattern: string): boolean {
        const schema = this.joi.date().format(pattern);

        try {
            const dI = this.joi.attempt(dataInicial, schema);
            const dF = this.joi.attempt(dataFinal, schema);

            if (!dI || !dF) {
                return false;
            }

            if (dI.getTime() > dF.getTime()) {
                return false;
            }
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Valida se um range de datas é válido: @dataInicial <= @dataFinal
     * @param dataInicial data inicial a ser validada
     * @param dataFinal data final a ser validada
     * @returns true/false
     */
    public isValidDateRange(dataInicial: Date, dataFinal: Date): boolean {
        if (!dataInicial || !dataFinal) {
            return false;
        }

        if (dataInicial.getTime() > dataFinal.getTime()) {
            return false;
        }

        return true;
    }
}
