import * as moment from "moment-timezone";

const TZ = "America/Sao_Paulo";
const TZ_UTC = process.env.TZ || "America/Sao_Paulo";

export class DateSerializer {
  /**
   * converte um Date para uma string
   * @param source Date a ser convertida
   * @param pattern mascara a ser utilizada, default: "YYYY-MM-DDTHH:mm:ss"
   * @param timezone caso se deseje utilizar timezone na serializacao. Default: false
   */
  public serialize(source: Date, timezone?: boolean, pattern?: string): string {
    if (source) {
      pattern = pattern ? pattern : "YYYY-MM-DDTHH:mm:ss";
      if (timezone) {
        return moment(source).tz(TZ).format(pattern);
      }
      return moment(source).tz(TZ_UTC).format(pattern);
    }
  }
}
