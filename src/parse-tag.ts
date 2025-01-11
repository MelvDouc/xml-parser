import NodeKind from "$/constants/NodeKind.ts";
import type { OrphanTagNode, RegularTagNode } from "$/types.ts";

const tagNameRegex = /^\S+/;
const attributeRegex = /(?<key>[\w-:]+)(="(?<val>[^"]*)")?/g;

function splitTag(value: string): [tagName: string, attrString: string] {
  const [tagName] = value.match(tagNameRegex) as RegExpMatchArray;
  return [tagName, value.slice(tagName.length).trim()];
}

function parseAttributes(attrString: string): Record<string, string> {
  const attributes = {} as Record<string, string>;

  for (const { groups } of attrString.matchAll(attributeRegex)) {
    const { key, val } = groups as Record<string, string>;
    attributes[key] = val ?? "";
  }

  return attributes;
}

export function parseOpeningTag(value: string): RegularTagNode {
  const [tagName, attrString] = splitTag(value);
  const node: RegularTagNode = {
    kind: NodeKind.RegularTag,
    tagName,
    children: []
  };

  if (attrString)
    node.attributes = parseAttributes(attrString);

  return node;
}

export function parseOrphanTag(value: string, isDeclaration: boolean): OrphanTagNode {
  const [tagName, attrString] = splitTag(value);
  const node: OrphanTagNode = {
    kind: NodeKind.OrphanTag,
    tagName,
    isDeclaration
  };

  if (attrString)
    node.attributes = parseAttributes(attrString);

  return node;
}