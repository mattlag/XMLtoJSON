
String.prototype.ss = String.prototype.substring;
String.prototype.io = String.prototype.indexOf;
String.prototype.ca = String.prototype.charAt;

function parseXMLtag (tag) {
	console.log('\nTAG\n' + tag.ss(0, 20) + '...');
	tag = tag.replace(/(\r\n|\n|\r)/gm,"");
	while(tag.ca(0) !== '<') tag = tag.ss(1);

	if(tag.ca(1) === '!' || tag.ca(1) === '?') {
		return parseXMLtag(tag.ss(tag.io('>')+1));
	}

	var tagname_endpos = Math.min(tag.io(' '), Math.min(tag.io('/'), tag.io('>')));
	var tagname = tag.ss(1, tagname_endpos);
	console.log('\t tag name: ' + tagname);
	var tagattributes = parseXMLattributes(tag.ss(tagname_endpos, tag.io('>')));
	var tagcontent = parseXMLcontent(tag.ss(tag.io('>')+1, tag.io('</'+tagname+'>')));

	var result = {
		'name' : tagname,
		'attributes' : tagattributes,
		'content' : tagcontent
	};

	console.log('TAG ' + tagname + ' RETURNING\n=======================');
	return result;
}

function parseXMLattributes (attr) {
	console.log('\nATTRIBUTES');

	while(attr.io(' =') > -1) attr = attr.replace(' =', '=');
	while(attr.io('= ') > -1) attr = attr.replace('= ', '=');
	while(attr.ca(0) === ' ') attr = attr.ss(1);

	if(!attr) {
		console.log('\t false attributes, returning []');
		return [];
	} else {
		console.log(attr);
	}

	attr = attr.split(' ');
	console.log('\t attr.split.length: ' + attr.length);
	var result = [];
	var pair = [];

	for(var a=0; a<attr.length; a++){
		pair = attr[a].split('=');
		if(pair[1]){
			result.push({
				'name' : pair[0],
				'value' : pair[1].ss(1, pair[1].length-1)
			});
		}
	}

	return result;
}

function parseXMLcontent (con) {
	while(con.ca(0) === ' ') con = con.ss(1);
	console.log('\nCONTENT');
	console.log(con);

	if(con.ca(0) !== '<') return con;

	var result = [];
	var startpos = 0;
	var endpos = 0;
	var tagname = '';
	var tagname_endpos = 0;
	var trytimes = 0;

	while(true){
		console.log('\ttrytimes: ' + trytimes);
		tagname_endpos = Math.min(con.io(' '), Math.min(con.io('/'), con.io('>')));
		tagname = con.ss(startpos+1, tagname_endpos);
		console.log('\ttag name: ' + tagname);
		endpos = con.io('</'+tagname+'>') + 3 + tagname.length;
		result.push(parseXMLtag(con.ss(startpos, endpos)));

		con = con.ss(endpos);
		if(con === '' || trytimes > 10) return result;
		startpos = 0;
		endpos = 0;
	}

	return result;
}