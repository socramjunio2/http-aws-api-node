export class EntityResult {
  constructor(
    public code?: string,
    public info?: string,
    public message?: string,
  ) { }
}

export class EntityResultCreator {
  public static ofCodeAndInfoAndMessage(code: string, info: string, message: string): EntityResult {
    return new EntityResult(code, info, message);
  }
  public static ofCode(code: string): EntityResult {
    return new EntityResult(code);
  }
}
