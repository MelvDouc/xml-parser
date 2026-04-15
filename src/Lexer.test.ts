import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import TokenKind from "$/constants/TokenKind.ts";
import Lexer from "$/Lexer.ts";

describe("A lexer should detect", () => {
  it("an orphan tag", () => {
    const input = `<input />`;
    const lexer = new Lexer(input);
    const tokens = [...lexer.lex()];
    assertEquals(tokens.length, 2);
    assert(tokens[0].kind === TokenKind.OrphanTag);
  });

  it("an XML declaration", () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>`;
    const lexer = new Lexer(input);
    const tokens = [...lexer.lex()];
    assertEquals(tokens.length, 2);
    assert(tokens[0].kind === TokenKind.Declaration);
  });

  it("a comment", () => {
    const input = `<p>text <!-- comment --></p>`;
    const lexer = new Lexer(input);
    const tokens = [...lexer.lex()];
    assertEquals(tokens.length, 5);
    assertEquals(tokens[2].kind, TokenKind.Comment);
  });

  it("a bad token", () => {
    const input = `<div>></div>`;
    const lexer = new Lexer(input);
    const tokens = [...lexer.lex()];
    assertEquals(tokens.length, 4);
    assert(tokens[1].kind === TokenKind.Bad);
  });
});