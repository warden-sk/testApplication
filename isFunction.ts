/*
 * Copyright 2023 Marek Kobida
 */

function isFunction(input: unknown): input is Function {
  return typeof input === 'function';
}

export default isFunction;
