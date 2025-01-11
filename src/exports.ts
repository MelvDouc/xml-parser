import NodeKind from "$/constants/NodeKind.ts";
import Parser from "$/Parser.ts";
import type {
  BadNode,
  CommentNode,
  OrphanTagNode,
  RegularTagNode,
  TextNode,
  XmlNode
} from "$/types.ts";

/**
 * Breaks the provided input down into tag and text nodes.
 * @param input XML/HTML text.
 * @returns An array of nodes.
 */
function parse(input: string): XmlNode[] {
  return new Parser(input).parse();
}

export {
  NodeKind,
  parse,
  type BadNode,
  type CommentNode,
  type OrphanTagNode,
  type RegularTagNode,
  type TextNode,
  type XmlNode
};
