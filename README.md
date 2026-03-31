# XMLtoJSON

I know there are probably 13.5 Million of these already, but I wanted to do one myself, okay?

## How to use

#### 1. Use locally (direct .js import)

If you have the XMLtoJSON.js file locally, you can import and use it as an ES module:

```js
// Import the function (ES module)
import { XMLtoJSON } from './XMLtoJSON.js';

const xmlString = `<note><to>User</to><from>AI</from><body>Hello!</body></note>`;
const result = XMLtoJSON(xmlString);
console.log(result);
```

#### 2. Install from npm (scoped package)

First, install the package:
```sh
npm install @mattlag/xmltojson
```

Then import and use it in your project:

```js
// Import from node_modules (ES module)
import { XMLtoJSON } from '@mattlag/xmltojson';

const xmlString = `<note><to>User</to><from>AI</from><body>Hello!</body></note>`;
const result = XMLtoJSON(xmlString);
console.log(result);
```

> **Note:** The package is published under the `@mattlag` scope. Use `@mattlag/xmltojson` in your import and install commands.

#### Optional trim argument

The `XMLtoJSON` function accepts a second argument, `trimOptions`, which lets you control how whitespace, newlines, and tabs are handled in the parsed output. This is useful for cleaning up text content from XML nodes.

**Available options:**
- `trimWhitespace` (default: true): Remove leading and trailing spaces from text.
- `trimNewlines` (default: true): Remove all newline characters (\n, \r).
- `trimTabs` (default: true): Remove all tab characters (\t).

If you omit `trimOptions`, all three are enabled by default.

## Resulting xml_tag data structure

```javascript
{
    name : 'xml_tag_name',
    attributes : {
        'xml_attribute_name1' : 'XML Attribute value1',
        'xml_attribute_name2' : 'XML Attribute value2',
        'xml_attribute_name3' : 'XML Attribute value3',
        ...
    },
    content : [
        { xml_tags },
        { xml_tags },
        ...,
        'text content'
    ]
}
```

A proper JavaScript SyntaxError will be thrown if the XML is not properly formatted.

## Things to consider

XMLtoJSON is really focused on data, and not so much the metadata. So I did this:

- All comments are ignored &lt;!-- stuff like this --&gt;
- All declarations are ignored, stuff like &lt;?xml version="1.0" encoding="UTF-8"?>
- All CDATA sections are ignored, stuff like &lt;![CDATA[&lt;greeting&gt;Hello, world!&lt;/greeting&gt;]]&gt;
- Newline and Tab characters, like \r \n \t, are blindly removed from everywhere



# License & Copyright

Copyright © 2026 Matthew LaGrandeur

Released under [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0-standalone.html)

## Author

| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
| ---------------------------------------------------------------------------------------------------- |
| [Matthew LaGrandeur](http://mattlag.com/)                                                            |
| matt[at]mattlag[dot]com                                                                              |
