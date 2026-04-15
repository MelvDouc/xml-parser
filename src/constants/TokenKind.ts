const enum TokenKind {
  Bad,
  Text,
  Comment,
  Declaration,
  OpeningTag,
  ClosingTag,
  OrphanTag,
  EndOfInput
}

export default TokenKind;