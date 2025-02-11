# XML Parser

A minimalistic XML/HTML parser. It:

- breaks an input down into tag and text nodes,
- parses attributes,
- checks if all tags are closed.

Orphan (self-closing) tags are allowed.

## Usage

The XML string below

```xml
<?xml version="1.0" encoding="UTF-8"?>

<shopping-list>
  <item>eggs</item>
  <!-- <item>steaks</item> -->
  <item urgent="">shampoo</item>
  <item />
</shopping-list>
```

will output the following:

```javascript
[
  {
    kind: "ORPHAN_TAG_NODE",
    tagName: "xml",
    isDeclaration: true,
    attributes: { version: "1.0", encoding: "UTF-8" }
  },
  {
    kind: "REGULAR_TAG_NODE",
    tagName: "shopping-list",
    children: [
      {
        kind: "REGULAR_TAG_NODE",
        tagName: "item",
        children: [ { kind: "TEXT_NODE", value: "eggs" } ]
      },
      { kind: "COMMENT_NODE", value: " <item>steaks</item> " },
      {
        kind: "REGULAR_TAG_NODE",
        tagName: "item",
        children: [ { kind: "TEXT_NODE", value: "shampoo" } ],
        attributes: { urgent: "" }
      },
      {
        kind: "ORPHAN_TAG_NODE",
        tagName: "item",
        isDeclaration: false
      }
    ]
  }
]
```
