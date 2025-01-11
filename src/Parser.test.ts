import { assert, assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import Parser from "$/Parser.ts";
import NodeKind from "$/constants/NodeKind.ts";

describe("A parser should throw", () => {
  it("when finding an unclosed tag", () => {
    const input = `<p class="blue">`;
    assertThrows(() => new Parser(input).parse());
  });

  it("when finding a non-matching closing tag", () => {
    const input = `<p class="blue"></div>`;
    assertThrows(() => new Parser(input).parse());
  });
});

describe("Parser - sample data", () => {
  it("#1", async () => {
    const sample1 = await Deno.readTextFile("samples/sample1.xml");
    const nodes = new Parser(sample1).parse();
    assertEquals(nodes.length, 2);
  });

  it("#2", async () => {
    const sample2 = await Deno.readTextFile("samples/sample2.xml");
    const nodes = new Parser(sample2).parse();
    assertEquals(nodes.length, 2);
    const [a, b] = nodes;
    assert(a.kind === NodeKind.OrphanTag && a.isDeclaration);
    assert(b.kind === NodeKind.RegularTag && b.tagName === "project");
  });
});