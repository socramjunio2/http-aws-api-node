import { request } from "./http-request";

export class Authentication {

  // tslint:disable-next-line: variable-name
  private _token?: string;

  constructor(private username: string,
              private password: string,
              private endpoint: string,
              private login?: string) {
      this.login = this.login ? this.login : this.username;
     }

  public async authenticate<T>(executable: (token: string) => Promise<T>): Promise<T> {
    try {
      return await this.execute(executable);
    } catch (e) {
      this.token = null;
      return await this.execute(executable);
    }
  }

  public get token(): string {
    return this._token;
  }

  public set token(token: string) {
    this._token = token;
  }

  private async execute<T>(executable: (token: string) => Promise<T>): Promise<T> {
    const token = await this.getToken();
    return await executable(token);
  }

  private async getToken(): Promise<string> {
    if (!this.token) {
      const { body } = (await request().post(this.endpoint, {
        body: {
          login: this.username,
          password: this.password,
        }, json: true,
      }));
      this.token = body.accessToken;
    }
    return this.token;
  }

}
