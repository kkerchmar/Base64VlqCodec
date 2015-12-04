// BASE64 VLQ COder/DECoder AND SOURCEMAP V3 MAPPINGS PARSER
// http://murzwin.com/base64vlq.html

// Generating source maps
// http://qfox.nl/weblog/281

// More information
// http://www.thecssninja.com/javascript/source-mapping

var Base64 = {
    _encoding: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    encode: function encode(num){ return this._encoding[num]; },
    decode: function decode(chr){ return this._encoding.indexOf(chr); }
}

Base64Vlq = {
    encodeSegment: function encode(segment) {
        var vlq = '';
        for(var fieldIndex = 0; fieldIndex < segment.length; ++fieldIndex) {
            var field = segment[fieldIndex];
            vlq += this.encode(field);
        }

        return vlq;
    },
    encode: function encode(field) {
        var vlq = '';

        var sign = field < 0 | 0;
        field = (field << 1) + sign;
        do {
            var byte = field & 0x1F;
            if((field >> 5) > 0) {
                byte += 0x20;
            }

            vlq += Base64.encode(byte);

            field = field >> 5;
        } while(field > 0);

        return vlq;
    },
    decode: function decode(segment) {
        var bits = 0;
        var continuation = false;
        var fields = [];

        for(var i = 0; i < segment.length; ++i) {
            if(!continuation) {
                fields.push(0);
                bits = 0;
            }

            var byte = Base64.decode(segment[i]);

            continuation = (byte & 0x20) > 0; // 0b00100000
            fields[fields.length - 1] += (byte & 0x1F) * Math.pow(2, bits);
            bits += 5;

            if(!continuation) {
                if(fields[fields.length - 1] & 1) {
                    fields[fields.length - 1] = -fields[fields.length - 1];
                }

                fields[fields.length - 1] = fields[fields.length - 1] >> 1;
            }
        }

        return fields;
    }
};

console.log(Base64Vlq.decode('AAgBC'));
console.log(Base64Vlq.encodeSegment([0, 0, 16, 1]))
console.log(Base64Vlq.decode('6rk2B'));
console.log(Base64Vlq.encode(886973));
console.log(Base64Vlq.decode('6rB'));
console.log(Base64Vlq.encode(701));