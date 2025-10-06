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

	if (typeof window.DOMParser !== 'undefined') {
		XMLdoc = new window.DOMParser().parseFromString(inputXML, 'text/xml');
	} else if (
		typeof window.ActiveXObject !== 'undefined' &&
		new window.ActiveXObject('Microsoft.XMLDOM')
	) {
		XMLdoc = new window.ActiveXObject('Microsoft.XMLDOM');
		XMLdoc.async = 'false';
		XMLdoc.loadXML(inputXML);
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

		if (kids.length === 0) return trim(parent.nodeValue);

		const result = [];
		let tagResult;
		let tagContent;
		let tagAttributes;

		for (const node of kids) {
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
