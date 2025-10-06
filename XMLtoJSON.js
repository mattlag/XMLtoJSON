/**
 * XML to JSON does exactly what it sounds like.
 * Feed it an XML string, and it converts the data
 * to JSON format.
 * @param {String} inputXML - XML data
 * @param {Object} trimOptions - How to handle whitespace, newlines, and tabs
 * @return {Object} - Javascript object
 */
function XMLtoJSON(inputXML = '', trimOptions = {}) {
	const console_debug = false;
	// log('XMLtoJSON - start');
	// log(inputXML);
	const trimWhitespace = trimOptions.trimWhitespace || true;
	const trimNewlines = trimOptions.trimNewlines || true;
	const trimTabs = trimOptions.trimTabs || true;
	let XMLdoc;
	let XMLerror;

	// Check if we're in a browser environment
	if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
		XMLdoc = new window.DOMParser().parseFromString(inputXML, 'text/xml');
	} else if (
		typeof window !== 'undefined' &&
		typeof window.ActiveXObject !== 'undefined' &&
		new window.ActiveXObject('Microsoft.XMLDOM')
	) {
		XMLdoc = new window.ActiveXObject('Microsoft.XMLDOM');
		XMLdoc.async = 'false';
		XMLdoc.loadXML(inputXML);
	} else if (typeof require !== 'undefined') {
		// Node.js environment - use @xmldom/xmldom package
		try {
			const { DOMParser } = require('@xmldom/xmldom');
			XMLdoc = new DOMParser().parseFromString(inputXML, 'text/xml');
		} catch (e) {
			console.warn('@xmldom/xmldom package not found. Please install it with: npm install @xmldom/xmldom');
			XMLerror = new SyntaxError('@xmldom/xmldom package required for Node.js environment. Install with: npm install @xmldom/xmldom');
			throw XMLerror;
		}
	} else {
		console.warn('No XML document parser found.');
		XMLerror = new SyntaxError('No XML document parser found.');
		throw XMLerror;
	}

	const error = XMLdoc.getElementsByTagName('parsererror');
	if (error.length) {
		const message = XMLdoc.getElementsByTagName('div')[0].innerHTML;
		XMLerror = new SyntaxError(trim(message));
		throw XMLerror;
	}

	const result = {
		name: XMLdoc.documentElement.nodeName,
		attributes: tag_getAttributes(XMLdoc.documentElement.attributes),
		content: tag_getContent(XMLdoc.documentElement),
	};
	// log(result);
	// log('XMLtoJSON - end');
	return result;

	function tag_getContent(parent) {
		const kids = parent.childNodes;
		// log(`\ntag_getContent - ${parent.nodeName}`);
		// log(kids);

		if (!kids || kids.length === 0) return trim(parent.nodeValue || '');

		const result = [];
		let tagResult;
		let tagContent;
		let tagAttributes;

		// Convert NodeList to Array to ensure it's iterable
		const childArray = Array.from(kids);

		for (const node of childArray) {
			tagResult = {};
			tagContent = tag_getContent(node);
			tagAttributes = tag_getAttributes(node.attributes);

			if (node.nodeName === '#text' && JSON.stringify(tagAttributes) === '{}') {
				tagResult = trim(tagContent);
			} else if (
				node.nodeName === '#comment' &&
				JSON.stringify(tagAttributes) === '{}'
			) {
				tagResult = `<!-- ${trim(tagContent)} -->`;
			} else {
				tagResult.name = node.nodeName;
				tagResult.attributes = tagAttributes;
				tagResult.content = tagContent;
			}

			if (tagResult !== '') result.push(tagResult);
		}

		// log(`tag_getContent - ${parent.nodeName} \n`);
		return result;
	}

	function tag_getAttributes(attributes) {
		if (!attributes || !attributes.length) return {};

		// log('\ntag_getAttributes');
		// log(attributes);

		const result = {};

		for (const attribute of attributes) {
			// log(`\t${attribute.name} : ${attribute.value}`);
			result[attribute.name] = trim(attribute.value);
		}

		// log('tag_getAttributes\n');
		return result;
	}

	function trim(text) {
		try {
			if (trimWhitespace) text = text.replace(/^\s+|\s+$/g, '');
			if (trimNewlines) text = text.replace(/(\r\n|\n|\r)/gm, '');
			if (trimTabs) text = text.replace(/\t/gm, '');
			return text;
		} catch (e) {
			return '';
		}
	}

	function log(text) {
		if (console_debug) console.log(text);
	}
}

// Export for different module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	// CommonJS (Node.js)
	module.exports = XMLtoJSON;
} else if (typeof define === 'function' && define.amd) {
	// AMD
	define(function() {
		return XMLtoJSON;
	});
} else {
	// Browser global
	if (typeof window !== 'undefined') {
		window.XMLtoJSON = XMLtoJSON;
	}
}
