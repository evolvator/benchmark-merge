var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var _ = require('lodash');
var async = require('async');

var uniqid = require('uniqid');

var generateObject = function(count) {
  var object = {};
  for (var i = 0; i < count; i++) {
    object[uniqid()] = uniqid();
  }
  return object;
};

async.timesSeries(
  10,
  function(t, next) {
    var count = Math.pow(2, t);

    async.series([
      function(next) {
        var suite = new Benchmark.Suite(`merge one object (${count}) with object (${count})`);
        
        var prepare = function() {
          return { a: generateObject(count), b: generateObject(count) };
        };
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'lodash@4.17.10 assign',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              _.assign(temp.a, temp.b);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'lodash@4.17.10 defaults',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              _.defaults(temp.b, temp.a);
            }
          });
        })();

        (function() {
          var temp = prepare();
          suite.add({
            name: 'Object.assign',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Object.assign(temp.a, temp.b);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'for a[key] = b[key]',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              var array = Object.keys(temp.b);
              for (var i = 0; i < array.length; i++) {
                temp.a[array[i]] = temp.b[array[i]];
              }
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          var keys = Object.keys(temp.b);
          var Generator = function() {};
          suite.add({
            name: 'prototype outer',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Generator.prototype = temp.a;
              var result = new Generator();
              var array = Object.keys(temp.b);
              for (var i = 0; i < array.length; i++) {
                result[array[i]] = temp.b[array[i]];
              }
            }
          });
        })();
    
        tb.wrapSuite(suite, () => next());
        suite.run({ async: true });
      },
      function(next) {
        var suite = new Benchmark.Suite(`create new based on two objects (${count})`);
        
        var prepare = function() {
          return { a: generateObject(count), b: generateObject(count) };
        };
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'lodash@4.17.10 assign',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              _.assign({}, temp.a, temp.b);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'lodash@4.17.10 defaults',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              _.defaults({}, temp.b, temp.a);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: '...spread',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              temp.a = { ...temp.a, ...temp.b };
            }
          });
        })();
    
        (function() {
          var __assign = (this && this.__assign) || Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
            }
            return t;
          };
          
          var temp = prepare();
          suite.add({
            name: 'ts ...spread',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              temp.a = __assign({}, temp.a, temp.b);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'Object.assign',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Object.assign({}, temp.a, temp.b);
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          suite.add({
            name: 'for new[key] = a&b[key]',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              var array;
              var result = {};
              array = Object.keys(temp.a);
              for (var i = 0; i < array.length; i++) {
                result[array[i]] = temp.a[array[i]];
              }
              array = Object.keys(temp.b);
              for (var i = 0; i < array.length; i++) {
                result[array[i]] = temp.b[array[i]];
              }
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          var Generator = function() {};
          suite.add({
            name: 'prototype outer',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Generator.prototype = temp.a;
              var result = new Generator();
              var array = Object.keys(temp.b);
              for (var i = 0; i < array.length; i++) {
                result[array[i]] = temp.b[array[i]];
              }
            }
          });
        })();
    
        tb.wrapSuite(suite, () => next());
        suite.run({ async: true });
      },
      function(next) {
        var suite = new Benchmark.Suite(`create new based on object (${count})`);
        
        var prepare = function() {
          return { a: generateObject(count), b: generateObject(count) };
        };
    
        (function() {
          var temp = prepare();
          var keys = Object.keys(temp.b);
          var Generator;
          eval(`Generator = function() {${keys.map(function(key) {
            return `this['${key}'] = temp.b['${key}'];`;
          }).join('')}}`);
          suite.add({
            name: 'prototype in code',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Generator.prototype = temp.a;
              var result = new Generator();
            }
          });
        })();
    
        (function() {
          var temp = prepare();
          var Generator = function() {};
          suite.add({
            name: 'prototype outer',
            onCycle: function() {
              temp = prepare();
            },
            fn: function() {
              Generator.prototype = temp.a;
              var result = new Generator();
              var array = Object.keys(temp.b);
              for (var i = 0; i < array.length; i++) {
                result[array[i]] = temp.a[array[i]];
              }
            }
          });
        })();
    
        tb.wrapSuite(suite, () => next());
        suite.run({ async: true });
      },
    ], function() {
      next();
    });
  }
);