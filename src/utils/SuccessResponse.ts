import { Response } from "./Response";

export class SuccessResponse<t> extends Response {
  data?: t;

  constructor(msg: string, data?: t, status: number = 200) {
    super(status, msg);
    this.data = data;
  }
}
