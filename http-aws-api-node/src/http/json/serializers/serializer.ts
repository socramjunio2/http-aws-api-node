export interface ISerializer<S, T> {
  serialize(source: S): T;
}
