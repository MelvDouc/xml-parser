import Parser from "$/Parser.ts";
import type { XmlNode } from "$/types.ts";
import type { ParserOptions } from "@melvdouc/xml-parser";

/**
 * Breaks the provided input down into tag and text nodes.
 * @param input XML/HTML text.
 * @returns An array of nodes.
 */
export default function parse(input: string, options: ParserOptions = {}): XmlNode[] {
  return new Parser(input, options).parse();
}