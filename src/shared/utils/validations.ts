export function emailIsValid(email: string): boolean {
  if (!email) {
    return false;
  }
  email = email.trim();
  email = email.toLowerCase();
  if (email.length > 150) {
    return false;
  }
  const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return regexEmail.test(email);
}