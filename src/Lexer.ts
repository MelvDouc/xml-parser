import {
  BANG,
  ANGLE_BRACKET_CLOSING,
  ANGLE_BRACKET_OPENING,
  COMMENT_END,
  COMMENT_START,
  DOUBLE_DASH,
  EOF,
  LINE_FEED,
  QUESTION_MARK,
  SLASH
} from "$/constants/SpecialCharacters.ts";
import TokenKind from "$/constants/TokenKind.ts";
import type { NonEndingToken, Position, Token } from "$/types.ts";

/**
 * Separates tags from inter-tag text by creating tokens.
 */
export default class Lexer {
  private static isTextCharacter(ch: string): boolean {
    return ch !== ANGLE_BRACKET_OPENING;
  }

  private static isTagCharacter(ch: string): boolean {
    return ch !== ANGLE_BRACKET_CLOSING;
  }

  private static isComment(_: string, output: string): boolean {
    return !output.endsWith(COMMENT_END);
  }

  private static createToken(kind: NonEndingToken["kind"], value: string, position: Position): NonEndingToken {
    return { kind, value, position };
  }

  private readonly input: string;
  private index = 0;
  private row = 1;
  private col = 1;

  public constructor(input: string) {
    this.input = input;
  }

  /**
  * Generates various tokens out of the provided input string.
  */
  public *lex(): Generator<Token> {
    let ch: string;

    do {
      const position = { row: this.row, col: this.col };
      ch = this.next();

      switch (ch) {
        case EOF:
          yield { kind: TokenKind.EndOfInput, position };
          break;
        case ANGLE_BRACKET_OPENING:
          yield this.bracketToken(position);
          break;
        case ANGLE_BRACKET_CLOSING:
          yield { kind: TokenKind.Bad, value: ch, position };
          break;
        default:
          yield this.textToken(ch, position);
      }
    } while (ch !== EOF);
  }

  private advance(): void {
    if (this.current() === LINE_FEED) {
      this.row++;
      this.col = 1;
    } else {
      this.col++;
    }

    this.index++;
  }

  private current(): string {
    return this.input.at(this.index) ?? EOF;
  }

  private next(): string {
    const ch = this.current();
    this.advance();
    return ch;
  }

  private scanWhile(predicate: ScanPredicate): string {
    let output = "";
    let ch = this.current();

    while (ch !== EOF && predicate(ch, output)) {
      output += ch;
      this.advance();
      ch = this.current();
    }

    return output;
  }

  private textToken(firstCh: string, position: Position): Token {
    const value = firstCh + this.scanWhile(Lexer.isTextCharacter);
    return Lexer.createToken(TokenKind.Text, value, position);
  }

  private commentToken(position: Position): Token {
    // current = ch after '!'
    const firstTwoChars = this.next() + this.next();

    if (firstTwoChars !== DOUBLE_DASH)
      return Lexer.createToken(TokenKind.Bad, firstTwoChars, position);

    const value = this.scanWhile(Lexer.isComment);
    return value.endsWith(COMMENT_END)
      ? Lexer.createToken(TokenKind.Comment, value.slice(0, value.length - 3), position)
      : Lexer.createToken(TokenKind.Bad, COMMENT_START + value, position);
  }

  private declarationToken(position: Position): Token {
    // current = ch after leading '?'
    const value = this.scanWhile(Lexer.isTagCharacter);

    if (!value.endsWith("?"))
      return Lexer.createToken(TokenKind.Bad, value, position);

    this.advance(); // Skip '>'
    return Lexer.createToken(TokenKind.Declaration, value.slice(0, -1), position);
  }

  private tagToken(firstCh: string, position: Position): Token {
    const value = firstCh + this.scanWhile(Lexer.isTagCharacter);
    this.advance(); // Skip >

    if (value[0] === SLASH)
      return Lexer.createToken(TokenKind.ClosingTag, value.slice(1), position);

    if (value.at(-1) === SLASH)
      return Lexer.createToken(TokenKind.OrphanTag, value.slice(0, -1), position);

    return Lexer.createToken(TokenKind.OpeningTag, value, position);
  }

  private bracketToken(position: Position): Token {
    const firstCh = this.next();

    switch (firstCh) {
      case BANG:
        return this.commentToken(position);
      case QUESTION_MARK:
        return this.declarationToken(position);
      default:
        return this.tagToken(firstCh, position);
    }
  }
}

type ScanPredicate = (ch: string, output: string) => boolean;