function XMLtoJSON(inputXML){

	var console_debug = false;

	inputXML = inputXML.replace(/(\r\n|\n|\r|\t)/gm,"");
	return parseXMLtag(inputXML);

	function parseXMLtag (tag) {
		log('\nVVVVVVVVVVVVVVVVVVVVVVVVV\nTAG\n' + tag.substring(0, 20) + '...');

		// Look for strange stuff & fix it
		if(tag === '') return {};

		while(tag.charAt(0) !== '<') tag = tag.substring(1);

		if(tag.charAt(1) === '?') {
			return parseXMLtag(tag.substring(tag.indexOf('>')+1));
		}

		if(tag.substring(0, 9) === '<![CDATA['){
			return parseXMLtag(tag.substring(tag.indexOf(']]>')+3));
		}

		if(tag.charAt(1) === '!'){
			return parseXMLtag(tag.substring(tag.indexOf('>')+1));
		}


		// Start Parsing
		var tagname_endpos = Math.min(tag.indexOf(' '), Math.min(tag.indexOf('/'), tag.indexOf('>')));
		var tagname = tag.substring(1, tagname_endpos);
		log('\t tag name: ' + tagname);
		var tagattributes = parseXMLattributes(tag.substring(tagname_endpos, tag.indexOf('>')));
		var tagcontent = parseXMLcontent(tag.substring(tag.indexOf('>')+1, tag.indexOf('</'+tagname+'>')));

		var result = {
			'name' : tagname,
			'attributes' : tagattributes,
			'content' : tagcontent
		};

		log('TAG ' + tagname + ' DONE\n^^^^^^^^^^^^^^^^^^^^^^^^^\n');
		return result;
	}

	function parseXMLcontent (con) {
		con = trim(con);
		log('\nCONTENT');
		log(con);

		if(con.charAt(0) !== '<') return con;

		var result = [];
		var shouldbreak = false;
		var startpos = 0;
		var endpos = 0;
		var slashpos = 0;
		var gtpos = 0;
		var tagname = '';
		var tagname_endpos = 0;

		while(true){
			// remove whitespace
			con = trim(con);

			// remove comments & stuff
			while(con.substring(0,4) === '<!--'){
				con = con.substring(con.indexOf('-->')+3);
				log('\tremoved comment, con is now ' + con);
				shouldbreak = true;
			}

			while(con.substring(0, 9) === '<![CDATA['){
				con = con.substring(con.indexOf(']]>')+3);
				log('\tremoved CDATA, con is now ' + con);
				shouldbreak = true;
			}

			// remove whitespace
			con = trim(con);

			if(con === ''){
				log('\tcontent is empty string');
				return result;
			}

			if(shouldbreak) {
				shouldbreak = false;
				break;
			}

			// get name
			gtpos = con.indexOf('>');
			slashpos = con.indexOf('/');
			tagname_endpos = Math.min(con.indexOf(' '), Math.min(gtpos, slashpos));
			tagname = con.substring(startpos+1, tagname_endpos);
			log('\ttag name: ' + tagname);

			// self closing?
			if(slashpos === (gtpos-1)){
				result.push({
					'name' : tagname,
					'attributes' : parseXMLattributes(con.substring(tagname_endpos, slashpos)),
					'content' : false
				});
				con = con.substring(gtpos+1);
			} else {
				endpos = con.indexOf('</'+tagname+'>') + 3 + tagname.length;
				result.push(parseXMLtag(con.substring(startpos, endpos)));
				con = con.substring(endpos);
			}

			con = trim(con);
			if(con === ''){
				log('\tdone with all tags in content');
				return result;
			}
			startpos = 0;
			endpos = 0;
		}

		return result;
	}

	function parseXMLattributes (attr) {
		log('\nATTRIBUTES');

		while(attr.indexOf(' =') > -1) attr = attr.replace(' =', '=');
		while(attr.indexOf('= ') > -1) attr = attr.replace('= ', '=');
		attr = trim(attr);

		if(!attr) {
			log('\t false attributes, returning {}');
			return {};
		} else {
			log(attr);
		}

		var result = {};
		var start = 0;
		var curr = 0;
		var quote = false;
		var attr_name = '';
		var attr_value = '';

		while(curr < attr.length){
			while(attr.charAt(0) === ' '){
				curr++;
				start++;
			}

			if(curr >= attr.length) break;

			for(var n=curr; n<(curr+256); n++){
				if(attr.charAt(curr) === '='){
					attr_name = attr.substring(start, curr);
					attr_name = trim(attr_name);
					break;
				} else {
					curr++;
				}
			}

			curr++;
			quote = attr.charAt(curr);
			curr++;
			start = curr;

			for(var v=curr; v<(curr+256); v++){
				if(attr.charAt(curr) === quote){
					attr_value = attr.substring(start, curr);
					attr_value = trim(attr_value);
					break;
				} else {
					curr++;
				}
			}

			result[attr_name] = attr_value;

			curr++;
			start = curr;
		}

		return result;
	}

	function log(text) { if(console_debug) console.log(text); }

	function trim(text) { return text.replace(/^\s+|\s+$/g, ''); }
}