   export function formatCardNumber(value: string) {
     return value
       .replace(/\D/g, "")
       .slice(0, 16)
       .replace(/(.{4})/g, "$1 ")
       .trim();
   }

   export function formatExpiry(value: string) {
     const digits = value.replace(/\D/g, "").slice(0, 4);
     return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
   }

   export function isValidCardNumber(value: string) {
     const digits = value.replace(/\s/g, "");
     if (!/^\d{16}$/.test(digits)) return false;

     let sum = 0;
     for (let i = 0; i < digits.length; i++) {
       let digit = Number(digits[digits.length - 1 - i]);
       if (i % 2 === 1) {
         digit *= 2;
         if (digit > 9) digit -= 9;
       }
       sum += digit;
     }
     return sum % 10 === 0;
   }

   export function isValidExpiry(value: string) {
     const match = /^(\d{2})\/(\d{2})$/.exec(value);
     if (!match) return false;

     const month = Number(match[1]);
     const year = 2000 + Number(match[2]);
     if (month < 1 || month > 12) return false;

     const firstDayAfterExpiry = new Date(year, month, 1);
     return firstDayAfterExpiry > new Date();
   }

   export function isValidCvv(value: string) {
     return /^\d{3}$/.test(value);
   }