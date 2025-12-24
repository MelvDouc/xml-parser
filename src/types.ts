import type NodeKinds from "$/constants/NodeKinds.ts";
import type TokenKind from "$/constants/TokenKind.ts";

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

export interface TagNode {
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
  kind: typeof NodeKinds.RegularTag;
  children: XmlNode[];
}

/**
 * Represents a self-closing element.
 * It can be an XML declaration.
 */
export interface OrphanTagNode extends TagNode {
  kind: typeof NodeKinds.OrphanTag;
  isDeclaration: boolean;
}

/**
 * Represents text found between matching tags.
 */
export interface TextNode {
  kind: typeof NodeKinds.Text;
  value: string;
}

/**
 * Represents text found between `<!-- -->`.
 */
export interface CommentNode {
  kind: typeof NodeKinds.Comment;
  value: string;
}

/**
 * An invalid node such as a lone '>'.
 */
export interface BadNode {
  kind: typeof NodeKinds.Bad;
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