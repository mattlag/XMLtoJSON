# XMLtoJSON
I know there are probably 13.5 Million of these already, but I wanted to do one myslef, okay?

### resulting xmltag data structure
```javascript
{
	name : 'xml_tagname',
	attributes : {
		'xml_attribute_name1' : 'XML Attribute value1',
		'xml_attribute_name2' : 'XML Attribute value2',
		'xml_attribute_name3' : 'XML Attribute value3',
		...
	},
	content : [ 
		{ xmltags },
		{ xmltags },
		'text values'
		...
	]
}
```

### Things to consider
XMLtoJSON is really focused on data, and not so much the metadata. So I did this:
* All comments are ignored &lt;!-- stuff like this --&gt;
* All declarations are ignored, stuff like <?xml version="1.0" encoding="UTF-8"?>
* All CDATA sections are ignored, stuff like &lt;![CDATA[&lt;greeting&gt;Hello, world!&lt;/greeting&gt;]]&gt; 
* Newline and Tab characters, like \r \n \t, are blindly removed from everywhere

## License
Copyright (C) 2014 Matthew LaGrandeur, released under [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0-standalone.html)

## Author
| ![Matthew LaGrandeur's picture](https://1.gravatar.com/avatar/f6f7b963adc54db7e713d7bd5f4903ec?s=70) |
|---|
| [Matthew LaGrandeur](http://mattlag.com/) |
| matt[at]mattlag[dot]com |



