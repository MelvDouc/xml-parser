import type TokenKind from "$/constants/TokenKind.ts";
import type NodeKind from "$/constants/NodeKind.ts";

// ===== ===== ===== ===== =====
// TOKEN
// ===== ===== ===== ===== =====

/**
 * Indicates the 2D coordinates of a character.
 * Used for debugging purposes.
 */
export interface Position {
  row: number;
  col: number;
}

export interface NonEndingToken {
  kind: Exclude<TokenKind, TokenKind.EndOfInput>;
  value: string;
  position: Position;
}

interface EndOfInputToken {
  kind: TokenKind.EndOfInput;
  position: Position;
}

export type Token = NonEndingToken | EndOfInputToken;

// ===== ===== ===== ===== =====
// NODE
// ===== ===== ===== ===== =====

interface TagNode {
  /**
   * The local name of the element as it appears in the source input.
   */
  tagName: string;
  /**
   * Boolean attributes are allowed.
   */
  attributes?: Record<string, string>;
}

/**
 * An opening tag with its attributes and child nodes.
 */
export interface RegularTagNode extends TagNode {
  kind: NodeKind.RegularTag;
  children: XmlNode[];
}

export interface OrphanTagNode extends TagNode {
  kind: NodeKind.OrphanTag;
  isDeclaration: boolean;
}

/**
 * Represents text found between matching tags.
 */
export interface TextNode {
  kind: NodeKind.Text;
  value: string;
}

export interface CommentNode {
  kind: NodeKind.Comment;
  value: string;
}

/**
 * An invalid node such as a lone '>'.
 */
export interface BadNode {
  kind: NodeKind.Bad;
  value: string;
  position: Position;
}

/**
 * A tag or text node.
 * The various types can be distinguished using the `kind` property.
 */
export type XmlNode =
  | RegularTagNode
  | OrphanTagNode
  | TextNode
  | CommentNode
  | BadNode;