import { IValidate } from "../validate";

/**
 * Classe que disponibiliza funcoes de validacao um CNPJ
 * @version 1.0
 * @since 02/04/2020
 * @author Eduardo Giovany Schweigert
 */
export class CNPJValidator implements IValidate<string> {

    /**
     * Valida se um CNPJ informado e valido
     * @param source CNPJ a ser validado
     * @returns true/false
     */
    public isValid(source: string): boolean {

        if (!source) {
            return false;
        }

        source = source.replace(/[^\d]+/g, "");

        if (source === "") {
            return false;
        }

        if (source.length !== 14) {
            return false;
        }

        // Elimina CNPJs invalidos conhecidos
        if (source === "00000000000000" ||
            source === "11111111111111" ||
            source === "22222222222222" ||
            source === "33333333333333" ||
            source === "44444444444444" ||
            source === "55555555555555" ||
            source === "66666666666666" ||
            source === "77777777777777" ||
            source === "88888888888888" ||
            source === "99999999999999") {
            return false;
        }
        // Valida DVs
        let tamanho = source.length - 2;
        let numeros = source.substring(0, tamanho);
        const digitos = source.substring(tamanho);
        let soma: number = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== +digitos.charAt(0)) {
            return false;
        }
        tamanho = tamanho + 1;
        numeros = source.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado === +digitos.charAt(1);

    }
}
