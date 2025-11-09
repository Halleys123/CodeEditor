# Language Scanner Blueprint

Each `scanner.json` describes how a language should be tokenised. The `meta` block captures shared facts: an identifier, supported extensions, compiler flags, and—most importantly—the ordered `token_classes` list that names the top-level categories every token can belong to. Optional `keyword_broader_classifications` entries spell out how those high-level classes break down into finer buckets.

The `keyword` section then lists every concrete lexeme we know about. Each entry ties a literal string (for example `vec3` or `#ifdef`) to the matching `token_classes` item through its `classification`, and refines that pairing with `type` and `sub_type` so the tokenizer can recognise vectors, storage qualifiers, control flow keywords, and similar sub-groups without needing extra hard-coded rules.

```json
{
  "meta": {
    "language_id": "",
    "display_name": "",
    "version": "1.0.0",
    "file_extensions": [""],
    "is_compiled": true,
    "compiler_settings": {},
    "token_classes": ["keyword", "literal"],
    "broader_classifications": {
      "keyword": {
        "data_types": [],
        "storage_qualifiers": [""],
        "control_flow": [""],
        "misc": [""],
        "preprocessor": [""]
      }
      "literal": {
        "numeric": [""],
        "string": [""],
        "boolean": [""]
      }
    }
  },
  "keyword": {
    "": {
      "classification": "keyword",
      "type": "",
      "sub_type": ""
    }
  }
}
```
