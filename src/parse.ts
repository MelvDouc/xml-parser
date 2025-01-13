import Parser from "$/Parser.ts";
import type { XmlNode } from "$/types.ts";

/**
 * Breaks the provided input down into tag and text nodes.
 * @param input XML/HTML text.
 * @returns An array of nodes.
 */
export default function parse(input: string): XmlNode[] {
  return new Parser(input).parse();
}