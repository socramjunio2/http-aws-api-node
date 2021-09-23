import { DateDeserializer, DateSerializer } from "../../..";

export function dateSerializer(): (data: Date) => string {
  return (data): string => {
    return new DateSerializer().serialize(data);
  };
}
export function dateDeserializer(): (data: string) => Date {
  return (data): Date => {
    return new DateDeserializer().deserialize(data);
  };
}
