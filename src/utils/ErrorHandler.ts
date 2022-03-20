import { Response } from "./Response";

export class ErrorHandler extends Response {
  slug?: string;

  constructor(status: number, msg?: string, slug?: string) {
    super(status, msg);
    this.slug = slug;
  }

  UnexpectedError(msg = "Unexpected Error", slug = "unexpected_error") {
    return new ErrorHandler(500, msg, slug);
  }

  NotFound() {
    return new ErrorHandler(404, "Not Found", "not_found");
  }
}
