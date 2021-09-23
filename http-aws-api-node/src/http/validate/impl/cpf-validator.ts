import { IValidate } from "../validate";

/**
 * Classe que disponibiliza funcoes de validacao um CPF
 * @version 1.0
 * @since 02/04/2020
 * @author Eduardo Giovany Schweigert
 */
export class CPFValidator implements IValidate<string> {

    /**
     * Valida se um CPF informado e valido
     * @param source CPF a ser validado
     * @returns true/false
     */
    public isValid(source: string): boolean {
        const arr = [
            "00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
            "55555555555", "66666666666", "77777777777", "88888888888", "99999999999",
        ];

        if (!source || source.length !== 11 || arr.indexOf(source) !== -1) {
            return false;
        }

        let j = 10;
        let resto;
        let numero;
        let digito1;
        let digito2;
        let somatorio = 0;
        let cpfAux;
        let caracter = "";
        const numeros = "0123456789";

        cpfAux = source.substring(0, 9);

        for (let i = 0; i < 9; i++) {
            caracter = cpfAux.charAt(i);

            if (numeros.search(caracter) === -1) {
                return false;
            }

            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }

        resto = somatorio % 11;
        digito1 = 11 - resto;

        if (digito1 > 9) {
            digito1 = 0;
        }

        j = 11;
        somatorio = 0;
        cpfAux = cpfAux + digito1;

        for (let i = 0; i < 10; i++) {
            caracter = cpfAux.charAt(i);
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }

        resto = somatorio % 11;
        digito2 = 11 - resto;

        if (digito2 > 9) {
            digito2 = 0;
        }

        cpfAux = cpfAux + digito2;

        return source === cpfAux;
    }
}
