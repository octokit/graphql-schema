import { readFileSync } from 'node:fs/promises';
import validate from './lib/validate.js';

export { validate };
export const schema = {
  get idl () {
    return readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8')
  },
  json: JSON.parse(readFileSync(new URL('./schema.json', import.meta.url), 'utf8'))
}
