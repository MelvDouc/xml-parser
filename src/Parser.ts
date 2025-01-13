import NodeKinds from "$/constants/NodeKinds.ts";
import TokenKind from "$/constants/TokenKind.ts";
import Lexer from "$/Lexer.ts";
import { parseOpeningTag, parseOrphanTag } from "$/parse-tag.ts";
import type { NonEndingToken, RegularTagNode, Token, XmlNode } from "$/types.ts";

/**
 * A class tasked with creating nodes out of the tokens found in a given input string.
 */
export default class Parser {
  private readonly tokens: Token[];

  public constructor(input: string) {
    this.tokens = [...new Lexer(input).lex()];
  }

  /**
   * Break the source input into tag and text nodes.
   * @returns An array of the nodes found at the root of the input.
   */
  public parse(): XmlNode[] {
    const stack: RegularTagNode[] = [
      {
        kind: NodeKinds.RegularTag,
        tagName: "",
        children: []
      }
    ];
    let parent = stack[0];

    for (const token of this.tokens) {
      switch (token.kind) {
        case TokenKind.Bad:
          parent.children.push({ ...token, kind: NodeKinds.Bad });
          break;
        case TokenKind.Text:
          this.handleTextToken(token, parent);
          break;
        case TokenKind.Comment:
          parent.children.push({ kind: NodeKinds.Comment, value: token.value });
          break;
        case TokenKind.OrphanTag:
          this.handleOrphan(token, parent, false);
          break;
        case TokenKind.Declaration:
          this.handleOrphan(token, parent, true);
          break;
        case TokenKind.OpeningTag:
          parent = this.handleOpeningTag(token, parent);
          stack.push(parent);
          break;
        case TokenKind.ClosingTag:
          this.checkClosingTag(token, parent);
          stack.pop();
          parent = stack[stack.length - 1];
          break;
      }
    }

    if (stack.length !== 1)
      throw new Error("Unclosed tag at end of input.");

    return stack[0].children;
  }

  /**
   * Create a new node from an opening tag and add it to the current parent.
   * @returns The newly created node.
   */
  private handleOpeningTag(token: NonEndingToken, parent: RegularTagNode): RegularTagNode {
    const node = parseOpeningTag(token.value);
    parent.children.push(node);
    return node;
  }

  /**
   * Create a new orphan tag node from an opening tag and add it to the current parent.
   */
  private handleOrphan(token: NonEndingToken, parent: RegularTagNode, isDeclaration: boolean): void {
    const node = parseOrphanTag(token.value, isDeclaration);
    parent.children.push(node);
  }

  /**
   * Ensure that the opening and closing tags match.
   */
  private checkClosingTag(token: NonEndingToken, parent: RegularTagNode): void {
    if (token.value !== parent.tagName) {
      const { row, col } = token.position;
      throw new Error(`Unexpected closing tag at (${row}:${col}).`);
    }
  }

  /**
   * Add a new text token to the current parent if the text isn't just whitespace.
   */
  private handleTextToken(token: NonEndingToken, parent: RegularTagNode): void {
    const value = token.value.trim();

    if (value)
      parent.children.push({ kind: NodeKinds.Text, value });
  }
}