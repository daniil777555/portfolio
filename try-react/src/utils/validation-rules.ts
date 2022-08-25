export const validationRules = {
  required: (val: string) => !!val || 'Required field',
  minLength3: (val: string) => val.length >= 3 || `Length has to be greater than ${3}`
}