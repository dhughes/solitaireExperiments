// String.prototype.leftPadTo = function(toLen){
// 	var spaces = "";
//
// 	for(var i = 0 ; i < toLen - this.length ; i++){
// 		spaces += " ";
// 	}
//
// 	return spaces + this.toString();
// };

String.prototype.indent = function(depth) {
  var spaces = new Array(depth * 11).join(' ');

  var string = this.toString();
  string = string.split('\r\n');

  for (var i = 0; i < string.length; i++) {
    string[i] = spaces + string[i];
  }

  return string.join('\r\n');
};

Uint8Array.ofSize = function(size) {
  return new Uint8Array(size).map(() => 255);
};

/**
 * Returns the last item off a typed array (that's not 0)
 * @returns {int} The last non-zero element in the array.
 */
Uint8Array.prototype.last = function() {
  return this[this.len() - 1];
};

/**
 * Returns the length of a typed array, excluding any trailing zeros.
 * @returns {int} The length, ignoring trailing
 */
Uint8Array.prototype.len = function() {
  var len = this.length;
  var gte = -1;
  var lte = len - 1;

  //console.log(gte + " <= ??? <= " + lte);

  // loop forwards
  //var x = 0;
  while (gte !== lte) {
    //x++;
    // let's guess the half way point between gte and lte
    var guess = gte + Math.round((lte - gte) / 2);
    //console.log(gte + " <= " + guess + " <= " + lte);
    // is the guess a 255-field?
    if (this[guess] === 255) {
      lte = guess - 1;

      //console.log("guess found an empty slot, we know the end is less than or equal to " + lte);
    } else {
      gte = guess;

      //console.log("guess found a non-empty slot, we know the end is greater than or equal to " + gte);
    }

    /*if(x > 100){
			return;
		}*/
  }

  //console.log(gte + " <= " + lte);

  //console.log(gte+1);

  return gte + 1;
};

// /**
//  * Returns the index of the provided value
//  * @param {int} value the value to find the index of
//  * @returns {int} the index of the value
//  */
// Uint8Array.prototype.indexOf = function(value) {
//   for (var i = 0; i < this.length; i++) {
//     if (this[i] === value) {
//       return i;
//     }
//   }
//   return -1;
// };

/**
 * Duplicates the array to a new array
 * @returns {Uint8Array} A copy of the array
 */
Uint8Array.prototype.clone = function() {
  var res = new Uint8Array(this.length);
  res.set(this);
  return res;

  /*for(var i = 0 ; i < this.length ; i++){
		res[i] = this[i];
	}
	return res;*/
};

/**
 * Adds the provided value onto the end (first zero-value) of a typed array
 * @param val
 */
Uint8Array.prototype.push = function(val) {
  this[this.len()] = val;
};

/**
 * Indicates if the array is empty (starts with 0)
 * @return {Boolean}
 */
Uint8Array.prototype.empty = function() {
  return this[0] === 0;
};

/**
 * Creates a string representation of the array
 * @return {String}
 */
Uint8Array.prototype.asString = function() {
  var str = '[';
  for (var i = 0; i < this.length; i++) {
    str += this[i];
    if (i !== this.length - 1) {
      str += ',';
    }
  }
  str += ']';
  return str;
};

/**
 * Resets the contents of this Uint8Array with the contents of the provided
 * array. Any missing values in the provided array are set to zero.
 * @param  {[type]} arr The array to replace this array's values with
 */
Uint8Array.prototype.resetFrom = function(arr) {
  this.forEach((val, i) => (this[i] = i < arr.len() ? arr[i] : -1));
};

/**
 * A quick and dirty method to see more details about an object when logging it
 * @return {String}

Object.prototype.foo = function(){
	var str = "{";
	for(var x in this){
		if(x !== "asString"){
			str += x + ":" + this[x] + ", ";
		}
	}
	str += "}";
	return str;
};
 */
