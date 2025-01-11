import { assertEquals, assertFalse } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import NodeKind from "$/constants/NodeKind.ts";
import { parseOpeningTag } from "$/parse-tag.ts";

describe("parseOpeningTag", () => {
  it("should know when there are no tags", () => {
    const node = parseOpeningTag(`div`);
    assertEquals(node.kind, NodeKind.RegularTag);
    assertEquals(node.tagName, "div");
    assertFalse(node.attributes);
  });

  it("should identify a tag with attributes", () => {
    const node = parseOpeningTag(`div id="my-div" autofocus`);
    assertEquals(node.kind, NodeKind.RegularTag);
    assertEquals(node.tagName, "div");
    assertEquals(node.attributes?.id, "my-div");
    assertEquals(node.attributes?.autofocus, "");
  });
});