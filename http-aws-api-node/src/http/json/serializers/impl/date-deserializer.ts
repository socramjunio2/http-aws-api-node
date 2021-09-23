import * as moment from "moment-timezone";

const TZ = "America/Sao_Paulo";
const TZ_UTC = process.env.TZ || "America/Sao_Paulo";

export class DateDeserializer {
  /**
   * converte uma string para Date
   * @param source data a ser convertida
   * @param pattern mascara a ser utilizada, default: "YYYY-MM-DDTHH:mm:ss"
   * @param timezone caso se deseje utilizar timezone na deserializacao. Default: false
   */
  public deserialize(source: string, timezone?: boolean, pattern?: string): Date {
    if (source) {
      pattern = pattern ? pattern : "YYYY-MM-DDTHH:mm:ss";
      if (timezone) {
        return moment(source).tz(TZ).toDate();
      }
      return moment(source).tz(TZ_UTC).toDate();
    }
  }
}
