export class HTTPError extends Error {
  constructor(public status: number, message: string, public messages: string[]) {
    super(message)
    this.status = status
    this.messages = messages
    this.name = "HTTPError"
  }
}