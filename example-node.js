const XMLtoJSON = require('./XMLtoJSON.js');

// Example XML string
const xmlString = `
<bookstore>
    <book id="1" category="fiction">
        <title>The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <price currency="USD">12.99</price>
    </book>
    <book id="2" category="non-fiction">
        <title>A Brief History of Time</title>
        <author>Stephen Hawking</author>
        <price currency="USD">15.99</price>
    </book>
</bookstore>
`;

try {
    const result = XMLtoJSON(xmlString);
    console.log('Converted XML to JSON:');
    console.log(JSON.stringify(result, null, 2));
} catch (error) {
    console.error('Error parsing XML:', error.message);
}