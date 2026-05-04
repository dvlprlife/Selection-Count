export function countCharacters(text: string): number {
  return text.length;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(token => token.length > 0).length;
}

export function countLetters(text: string): number {
  return (text.match(/\p{L}/gu) ?? []).length;
}

export function countNumbers(text: string): number {
  return (text.match(/\p{N}/gu) ?? []).length;
}

export function countSpecial(text: string): number {
  return (text.match(/[^\p{L}\p{N}\s]/gu) ?? []).length;
}
