import { HTTPError } from './HTTPError'

export const makeHTTPError = (status: number, message: string, messages: string[]) => {
  return new HTTPError(status, message, messages)
}