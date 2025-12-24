import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

export const capitalize = (input: string) => {
  return input.substring(0, 1).toUpperCase() + input.substring(1);
}

export const sanitizeApiParam = (param: string) => {
  const dom = new JSDOM();
  const { window } = dom;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(param);
}