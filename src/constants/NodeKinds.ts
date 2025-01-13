/**
 * Distinguishes between text nodes and various tag nodes.
 */
const NodeKinds = {
  Bad: "BAD_NODE",
  Text: "TEXT_NODE",
  Comment: "COMMENT_NODE",
  RegularTag: "REGULAR_TAG_NODE",
  OrphanTag: "ORPHAN_TAG_NODE"
} as const;

export default NodeKinds;
export type NodeKind = typeof NodeKinds[keyof typeof NodeKinds];