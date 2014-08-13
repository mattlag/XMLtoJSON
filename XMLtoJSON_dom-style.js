function XMLtoJSON(inputXML){
	var console_debug = true;
	var XMLdoc;
	inputXML = inputXML.replace(/(\r\n|\n|\r|\t)/gm,"");
	log('PASSED\n' + inputXML);

	if (typeof window.DOMParser != "undefined") {
		XMLdoc = (new window.DOMParser()).parseFromString(inputXML, "text/xml");
	} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
		XMLdoc = new window.ActiveXObject("Microsoft.XMLDOM");
		XMLdoc.async = "false";
		XMLdoc.loadXML(inputXML);
	} else {
		console.log('No XML document parser found, returning {}');
		return {};
	}

	if (XMLdoc.getElementsByTagName( "parsererror" ).length) {
		document.getElementById('json').parentNode.innerHTML = XMLdoc.body.innerHTML;
		throw "Invalid XML";
	}

	return {
		'name' : XMLdoc.documentElement.nodeName,
		'attributes' : parseXMLattributes(XMLdoc.documentElement.attributes),
		'content' : parseXMLtag(XMLdoc.documentElement)
	};


	function parseXMLtag(parent) {
		log('\nTAG: ' + parent.nodeName + '\t' + parent.childNodes.length);

		var kids = parent.childNodes;
		if(!kids || !kids.length) {
			log('\tno children, returning');
			log('\t'+parent.nodeValue);
			return parent.nodeValue;
		}
		var result = [];
		var node;

		for(var k=0; k<kids.length; k++){
			node = kids[k];
			if(node.nodeName.charAt(0) !== '#'){
				log('\t'+node.nodeName);
				result.push({
					'name' : node.nodeName,
					'attributes' : parseXMLattributes(node.attributes),
					'content' : parseXMLtag(node)
				});
			}
		}

		return result;
	}

	function parseXMLattributes(attributes) {
		if(!attributes || !attributes.length) return [];
		var result = [];
		var attr;

		for(var a=0; a<attributes.length; a++){
			log('\t\t'+attributes[a].name+' : '+attributes[a].value);
			result.push({
				'name' : attributes[a].name,
				'value' : attributes[a].value
			});
		}
		return result;
	}

	function log(text) { if(console_debug) console.log(text); }
}