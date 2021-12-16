export const isNumberInt = (n) => /^\d*$/.test(n);

export const isNumberDecimal = (n) => /^\d*\.?\d*$/.test(n);

export const isPhoneNumber = (n) => /(0[5-7])\d{8}/.test(n);

export const AddZero = (n) => ("0" + n).slice(-2);
