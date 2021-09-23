import { EntityError } from "./entity-error";
import { EntityResult } from "./entity-result";

export class Entity<T> {
  constructor(
    public result?: EntityResult,
    public errors?: EntityError[],
    public data?: T,
  ) { }
}
