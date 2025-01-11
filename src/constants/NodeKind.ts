/**
 * Distinguishes between text nodes and various tag nodes.
 */
enum NodeKind {
  Bad = "BAD_NODE",
  Text = "TEXT_NODE",
  Comment = "COMMENT_NODE",
  RegularTag = "REGULAR_TAG_NODE",
  OrphanTag = "ORPHAN_TAG_NODE"
}

export default NodeKind;