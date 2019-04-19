const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student',
	multipleStatements: true,
	typeCast: function castField(field, useDefaultTypeCasting) {
		if(field.name =='passed')console.log(field);
		// We only want to cast bit fields that have a single-bit in them. If the field
		// has more than one bit, then we cannot assume it is supposed to be a Boolean.
		if ((field.type === "BIT") && (field.length === 1)) {
			var bytes = field.buffer();

			// A Buffer in Node represents a collection of 8-bit unsigned integers.
			// Therefore, our single "bit field" comes back as the bits '0000 0001',
			// which is equivalent to the number 1.
			if (bytes == null) {
				return null;
			}
			return (bytes[0] === 1);

		}
		return (useDefaultTypeCasting());
	}
});
module.exports = connection;