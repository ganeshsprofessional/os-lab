// validators/index.js
import * as commandValidators from "./commandValidator.js";
import * as fileValidators from "./fileValidator.js";

export const validators = {
  ...commandValidators,
  ...fileValidators,
};
