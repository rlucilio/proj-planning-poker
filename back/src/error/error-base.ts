import { ErrorTypes } from './error-types';

export class ErrorBase extends Error {
  constructor (
        private msg: string,
        private type: ErrorTypes,
        private value: any
  ) {
    super();
  }
}
