"use strict";
var __TL__ = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@babel/runtime/helpers/interopRequireDefault.js
  var require_interopRequireDefault = __commonJS({
    "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports, module) {
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : {
          "default": e
        };
      }
      module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/ansi-styles/index.js
  var require_ansi_styles = __commonJS({
    "node_modules/ansi-styles/index.js"(exports, module) {
      "use strict";
      var ANSI_BACKGROUND_OFFSET = 10;
      var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
      var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
      function assembleStyles() {
        const codes = /* @__PURE__ */ new Map();
        const styles = {
          modifier: {
            reset: [0, 0],
            // 21 isn't widely supported and 22 does the same thing
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
          },
          color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            // Bright color
            blackBright: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
          },
          bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            // Bright color
            bgBlackBright: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
          }
        };
        styles.color.gray = styles.color.blackBright;
        styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
        styles.color.grey = styles.color.blackBright;
        styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
        for (const [groupName, group] of Object.entries(styles)) {
          for (const [styleName, style] of Object.entries(group)) {
            styles[styleName] = {
              open: `\x1B[${style[0]}m`,
              close: `\x1B[${style[1]}m`
            };
            group[styleName] = styles[styleName];
            codes.set(style[0], style[1]);
          }
          Object.defineProperty(styles, groupName, {
            value: group,
            enumerable: false
          });
        }
        Object.defineProperty(styles, "codes", {
          value: codes,
          enumerable: false
        });
        styles.color.close = "\x1B[39m";
        styles.bgColor.close = "\x1B[49m";
        styles.color.ansi256 = wrapAnsi256();
        styles.color.ansi16m = wrapAnsi16m();
        styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
        styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
        Object.defineProperties(styles, {
          rgbToAnsi256: {
            value: (red, green, blue) => {
              if (red === green && green === blue) {
                if (red < 8) {
                  return 16;
                }
                if (red > 248) {
                  return 231;
                }
                return Math.round((red - 8) / 247 * 24) + 232;
              }
              return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
            },
            enumerable: false
          },
          hexToRgb: {
            value: (hex) => {
              const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
              if (!matches) {
                return [0, 0, 0];
              }
              let { colorString } = matches.groups;
              if (colorString.length === 3) {
                colorString = colorString.split("").map((character) => character + character).join("");
              }
              const integer = Number.parseInt(colorString, 16);
              return [
                integer >> 16 & 255,
                integer >> 8 & 255,
                integer & 255
              ];
            },
            enumerable: false
          },
          hexToAnsi256: {
            value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
            enumerable: false
          }
        });
        return styles;
      }
      Object.defineProperty(module, "exports", {
        enumerable: true,
        get: assembleStyles
      });
    }
  });

  // node_modules/pretty-format/build/collections.js
  var require_collections = __commonJS({
    "node_modules/pretty-format/build/collections.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.printIteratorEntries = printIteratorEntries;
      exports.printIteratorValues = printIteratorValues;
      exports.printListItems = printListItems;
      exports.printObjectProperties = printObjectProperties;
      var getKeysOfEnumerableProperties = (object, compareKeys) => {
        const keys = Object.keys(object).sort(compareKeys);
        if (Object.getOwnPropertySymbols) {
          Object.getOwnPropertySymbols(object).forEach((symbol) => {
            if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
              keys.push(symbol);
            }
          });
        }
        return keys;
      };
      function printIteratorEntries(iterator, config, indentation, depth, refs, printer, separator = ": ") {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
          result += config.spacingOuter;
          const indentationNext = indentation + config.indent;
          while (!current.done) {
            const name = printer(
              current.value[0],
              config,
              indentationNext,
              depth,
              refs
            );
            const value = printer(
              current.value[1],
              config,
              indentationNext,
              depth,
              refs
            );
            result += indentationNext + name + separator + value;
            current = iterator.next();
            if (!current.done) {
              result += "," + config.spacingInner;
            } else if (!config.min) {
              result += ",";
            }
          }
          result += config.spacingOuter + indentation;
        }
        return result;
      }
      function printIteratorValues(iterator, config, indentation, depth, refs, printer) {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
          result += config.spacingOuter;
          const indentationNext = indentation + config.indent;
          while (!current.done) {
            result += indentationNext + printer(current.value, config, indentationNext, depth, refs);
            current = iterator.next();
            if (!current.done) {
              result += "," + config.spacingInner;
            } else if (!config.min) {
              result += ",";
            }
          }
          result += config.spacingOuter + indentation;
        }
        return result;
      }
      function printListItems(list, config, indentation, depth, refs, printer) {
        let result = "";
        if (list.length) {
          result += config.spacingOuter;
          const indentationNext = indentation + config.indent;
          for (let i = 0; i < list.length; i++) {
            result += indentationNext;
            if (i in list) {
              result += printer(list[i], config, indentationNext, depth, refs);
            }
            if (i < list.length - 1) {
              result += "," + config.spacingInner;
            } else if (!config.min) {
              result += ",";
            }
          }
          result += config.spacingOuter + indentation;
        }
        return result;
      }
      function printObjectProperties(val, config, indentation, depth, refs, printer) {
        let result = "";
        const keys = getKeysOfEnumerableProperties(val, config.compareKeys);
        if (keys.length) {
          result += config.spacingOuter;
          const indentationNext = indentation + config.indent;
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const name = printer(key, config, indentationNext, depth, refs);
            const value = printer(val[key], config, indentationNext, depth, refs);
            result += indentationNext + name + ": " + value;
            if (i < keys.length - 1) {
              result += "," + config.spacingInner;
            } else if (!config.min) {
              result += ",";
            }
          }
          result += config.spacingOuter + indentation;
        }
        return result;
      }
    }
  });

  // node_modules/pretty-format/build/plugins/AsymmetricMatcher.js
  var require_AsymmetricMatcher = __commonJS({
    "node_modules/pretty-format/build/plugins/AsymmetricMatcher.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _collections = require_collections();
      var global = (function() {
        if (typeof globalThis !== "undefined") {
          return globalThis;
        } else if (typeof global !== "undefined") {
          return global;
        } else if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else {
          return Function("return this")();
        }
      })();
      var Symbol2 = global["jest-symbol-do-not-touch"] || global.Symbol;
      var asymmetricMatcher = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("jest.asymmetricMatcher") : 1267621;
      var SPACE = " ";
      var serialize = (val, config, indentation, depth, refs, printer) => {
        const stringedValue = val.toString();
        if (stringedValue === "ArrayContaining" || stringedValue === "ArrayNotContaining") {
          if (++depth > config.maxDepth) {
            return "[" + stringedValue + "]";
          }
          return stringedValue + SPACE + "[" + (0, _collections.printListItems)(
            val.sample,
            config,
            indentation,
            depth,
            refs,
            printer
          ) + "]";
        }
        if (stringedValue === "ObjectContaining" || stringedValue === "ObjectNotContaining") {
          if (++depth > config.maxDepth) {
            return "[" + stringedValue + "]";
          }
          return stringedValue + SPACE + "{" + (0, _collections.printObjectProperties)(
            val.sample,
            config,
            indentation,
            depth,
            refs,
            printer
          ) + "}";
        }
        if (stringedValue === "StringMatching" || stringedValue === "StringNotMatching") {
          return stringedValue + SPACE + printer(val.sample, config, indentation, depth, refs);
        }
        if (stringedValue === "StringContaining" || stringedValue === "StringNotContaining") {
          return stringedValue + SPACE + printer(val.sample, config, indentation, depth, refs);
        }
        return val.toAsymmetricMatcher();
      };
      exports.serialize = serialize;
      var test = (val) => val && val.$$typeof === asymmetricMatcher;
      exports.test = test;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/ansi-regex/index.js
  var require_ansi_regex = __commonJS({
    "node_modules/ansi-regex/index.js"(exports, module) {
      "use strict";
      module.exports = ({ onlyFirst = false } = {}) => {
        const pattern = [
          "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
          "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
        ].join("|");
        return new RegExp(pattern, onlyFirst ? void 0 : "g");
      };
    }
  });

  // node_modules/pretty-format/build/plugins/ConvertAnsi.js
  var require_ConvertAnsi = __commonJS({
    "node_modules/pretty-format/build/plugins/ConvertAnsi.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _ansiRegex = _interopRequireDefault(require_ansi_regex());
      var _ansiStyles = _interopRequireDefault(require_ansi_styles());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var toHumanReadableAnsi = (text) => text.replace((0, _ansiRegex.default)(), (match) => {
        switch (match) {
          case _ansiStyles.default.red.close:
          case _ansiStyles.default.green.close:
          case _ansiStyles.default.cyan.close:
          case _ansiStyles.default.gray.close:
          case _ansiStyles.default.white.close:
          case _ansiStyles.default.yellow.close:
          case _ansiStyles.default.bgRed.close:
          case _ansiStyles.default.bgGreen.close:
          case _ansiStyles.default.bgYellow.close:
          case _ansiStyles.default.inverse.close:
          case _ansiStyles.default.dim.close:
          case _ansiStyles.default.bold.close:
          case _ansiStyles.default.reset.open:
          case _ansiStyles.default.reset.close:
            return "</>";
          case _ansiStyles.default.red.open:
            return "<red>";
          case _ansiStyles.default.green.open:
            return "<green>";
          case _ansiStyles.default.cyan.open:
            return "<cyan>";
          case _ansiStyles.default.gray.open:
            return "<gray>";
          case _ansiStyles.default.white.open:
            return "<white>";
          case _ansiStyles.default.yellow.open:
            return "<yellow>";
          case _ansiStyles.default.bgRed.open:
            return "<bgRed>";
          case _ansiStyles.default.bgGreen.open:
            return "<bgGreen>";
          case _ansiStyles.default.bgYellow.open:
            return "<bgYellow>";
          case _ansiStyles.default.inverse.open:
            return "<inverse>";
          case _ansiStyles.default.dim.open:
            return "<dim>";
          case _ansiStyles.default.bold.open:
            return "<bold>";
          default:
            return "";
        }
      });
      var test = (val) => typeof val === "string" && !!val.match((0, _ansiRegex.default)());
      exports.test = test;
      var serialize = (val, config, indentation, depth, refs, printer) => printer(toHumanReadableAnsi(val), config, indentation, depth, refs);
      exports.serialize = serialize;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/pretty-format/build/plugins/DOMCollection.js
  var require_DOMCollection = __commonJS({
    "node_modules/pretty-format/build/plugins/DOMCollection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _collections = require_collections();
      var SPACE = " ";
      var OBJECT_NAMES = ["DOMStringMap", "NamedNodeMap"];
      var ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;
      var testName = (name) => OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);
      var test = (val) => val && val.constructor && !!val.constructor.name && testName(val.constructor.name);
      exports.test = test;
      var isNamedNodeMap = (collection) => collection.constructor.name === "NamedNodeMap";
      var serialize = (collection, config, indentation, depth, refs, printer) => {
        const name = collection.constructor.name;
        if (++depth > config.maxDepth) {
          return "[" + name + "]";
        }
        return (config.min ? "" : name + SPACE) + (OBJECT_NAMES.indexOf(name) !== -1 ? "{" + (0, _collections.printObjectProperties)(
          isNamedNodeMap(collection) ? Array.from(collection).reduce((props, attribute) => {
            props[attribute.name] = attribute.value;
            return props;
          }, {}) : { ...collection },
          config,
          indentation,
          depth,
          refs,
          printer
        ) + "}" : "[" + (0, _collections.printListItems)(
          Array.from(collection),
          config,
          indentation,
          depth,
          refs,
          printer
        ) + "]");
      };
      exports.serialize = serialize;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/pretty-format/build/plugins/lib/escapeHTML.js
  var require_escapeHTML = __commonJS({
    "node_modules/pretty-format/build/plugins/lib/escapeHTML.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = escapeHTML;
      function escapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
    }
  });

  // node_modules/pretty-format/build/plugins/lib/markup.js
  var require_markup = __commonJS({
    "node_modules/pretty-format/build/plugins/lib/markup.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.printText = exports.printProps = exports.printElementAsLeaf = exports.printElement = exports.printComment = exports.printChildren = void 0;
      var _escapeHTML = _interopRequireDefault(require_escapeHTML());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var printProps = (keys, props, config, indentation, depth, refs, printer) => {
        const indentationNext = indentation + config.indent;
        const colors = config.colors;
        return keys.map((key) => {
          const value = props[key];
          let printed = printer(value, config, indentationNext, depth, refs);
          if (typeof value !== "string") {
            if (printed.indexOf("\n") !== -1) {
              printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
            }
            printed = "{" + printed + "}";
          }
          return config.spacingInner + indentation + colors.prop.open + key + colors.prop.close + "=" + colors.value.open + printed + colors.value.close;
        }).join("");
      };
      exports.printProps = printProps;
      var printChildren = (children, config, indentation, depth, refs, printer) => children.map(
        (child) => config.spacingOuter + indentation + (typeof child === "string" ? printText(child, config) : printer(child, config, indentation, depth, refs))
      ).join("");
      exports.printChildren = printChildren;
      var printText = (text, config) => {
        const contentColor = config.colors.content;
        return contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close;
      };
      exports.printText = printText;
      var printComment = (comment, config) => {
        const commentColor = config.colors.comment;
        return commentColor.open + "<!--" + (0, _escapeHTML.default)(comment) + "-->" + commentColor.close;
      };
      exports.printComment = printComment;
      var printElement = (type, printedProps, printedChildren, config, indentation) => {
        const tagColor = config.colors.tag;
        return tagColor.open + "<" + type + (printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open) + (printedChildren ? ">" + tagColor.close + printedChildren + config.spacingOuter + indentation + tagColor.open + "</" + type : (printedProps && !config.min ? "" : " ") + "/") + ">" + tagColor.close;
      };
      exports.printElement = printElement;
      var printElementAsLeaf = (type, config) => {
        const tagColor = config.colors.tag;
        return tagColor.open + "<" + type + tagColor.close + " \u2026" + tagColor.open + " />" + tagColor.close;
      };
      exports.printElementAsLeaf = printElementAsLeaf;
    }
  });

  // node_modules/pretty-format/build/plugins/DOMElement.js
  var require_DOMElement = __commonJS({
    "node_modules/pretty-format/build/plugins/DOMElement.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _markup = require_markup();
      var ELEMENT_NODE = 1;
      var TEXT_NODE = 3;
      var COMMENT_NODE = 8;
      var FRAGMENT_NODE = 11;
      var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
      var testHasAttribute = (val) => {
        try {
          return typeof val.hasAttribute === "function" && val.hasAttribute("is");
        } catch {
          return false;
        }
      };
      var testNode = (val) => {
        const constructorName = val.constructor.name;
        const { nodeType, tagName } = val;
        const isCustomElement = typeof tagName === "string" && tagName.includes("-") || testHasAttribute(val);
        return nodeType === ELEMENT_NODE && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE && constructorName === "Text" || nodeType === COMMENT_NODE && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
      };
      var test = (val) => {
        var _val$constructor;
        return (val === null || val === void 0 ? void 0 : (_val$constructor = val.constructor) === null || _val$constructor === void 0 ? void 0 : _val$constructor.name) && testNode(val);
      };
      exports.test = test;
      function nodeIsText(node) {
        return node.nodeType === TEXT_NODE;
      }
      function nodeIsComment(node) {
        return node.nodeType === COMMENT_NODE;
      }
      function nodeIsFragment(node) {
        return node.nodeType === FRAGMENT_NODE;
      }
      var serialize = (node, config, indentation, depth, refs, printer) => {
        if (nodeIsText(node)) {
          return (0, _markup.printText)(node.data, config);
        }
        if (nodeIsComment(node)) {
          return (0, _markup.printComment)(node.data, config);
        }
        const type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();
        if (++depth > config.maxDepth) {
          return (0, _markup.printElementAsLeaf)(type, config);
        }
        return (0, _markup.printElement)(
          type,
          (0, _markup.printProps)(
            nodeIsFragment(node) ? [] : Array.from(node.attributes).map((attr) => attr.name).sort(),
            nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce((props, attribute) => {
              props[attribute.name] = attribute.value;
              return props;
            }, {}),
            config,
            indentation + config.indent,
            depth,
            refs,
            printer
          ),
          (0, _markup.printChildren)(
            Array.prototype.slice.call(node.childNodes || node.children),
            config,
            indentation + config.indent,
            depth,
            refs,
            printer
          ),
          config,
          indentation
        );
      };
      exports.serialize = serialize;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/pretty-format/build/plugins/Immutable.js
  var require_Immutable = __commonJS({
    "node_modules/pretty-format/build/plugins/Immutable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _collections = require_collections();
      var IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
      var IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
      var IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
      var IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
      var IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
      var IS_RECORD_SENTINEL = "@@__IMMUTABLE_RECORD__@@";
      var IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
      var IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
      var IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
      var getImmutableName = (name) => "Immutable." + name;
      var printAsLeaf = (name) => "[" + name + "]";
      var SPACE = " ";
      var LAZY = "\u2026";
      var printImmutableEntries = (val, config, indentation, depth, refs, printer, type) => ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : getImmutableName(type) + SPACE + "{" + (0, _collections.printIteratorEntries)(
        val.entries(),
        config,
        indentation,
        depth,
        refs,
        printer
      ) + "}";
      function getRecordEntries(val) {
        let i = 0;
        return {
          next() {
            if (i < val._keys.length) {
              const key = val._keys[i++];
              return {
                done: false,
                value: [key, val.get(key)]
              };
            }
            return {
              done: true,
              value: void 0
            };
          }
        };
      }
      var printImmutableRecord = (val, config, indentation, depth, refs, printer) => {
        const name = getImmutableName(val._name || "Record");
        return ++depth > config.maxDepth ? printAsLeaf(name) : name + SPACE + "{" + (0, _collections.printIteratorEntries)(
          getRecordEntries(val),
          config,
          indentation,
          depth,
          refs,
          printer
        ) + "}";
      };
      var printImmutableSeq = (val, config, indentation, depth, refs, printer) => {
        const name = getImmutableName("Seq");
        if (++depth > config.maxDepth) {
          return printAsLeaf(name);
        }
        if (val[IS_KEYED_SENTINEL]) {
          return name + SPACE + "{" + // from Immutable collection of entries or from ECMAScript object
          (val._iter || val._object ? (0, _collections.printIteratorEntries)(
            val.entries(),
            config,
            indentation,
            depth,
            refs,
            printer
          ) : LAZY) + "}";
        }
        return name + SPACE + "[" + (val._iter || // from Immutable collection of values
        val._array || // from ECMAScript array
        val._collection || // from ECMAScript collection in immutable v4
        val._iterable ? (0, _collections.printIteratorValues)(
          val.values(),
          config,
          indentation,
          depth,
          refs,
          printer
        ) : LAZY) + "]";
      };
      var printImmutableValues = (val, config, indentation, depth, refs, printer, type) => ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : getImmutableName(type) + SPACE + "[" + (0, _collections.printIteratorValues)(
        val.values(),
        config,
        indentation,
        depth,
        refs,
        printer
      ) + "]";
      var serialize = (val, config, indentation, depth, refs, printer) => {
        if (val[IS_MAP_SENTINEL]) {
          return printImmutableEntries(
            val,
            config,
            indentation,
            depth,
            refs,
            printer,
            val[IS_ORDERED_SENTINEL] ? "OrderedMap" : "Map"
          );
        }
        if (val[IS_LIST_SENTINEL]) {
          return printImmutableValues(
            val,
            config,
            indentation,
            depth,
            refs,
            printer,
            "List"
          );
        }
        if (val[IS_SET_SENTINEL]) {
          return printImmutableValues(
            val,
            config,
            indentation,
            depth,
            refs,
            printer,
            val[IS_ORDERED_SENTINEL] ? "OrderedSet" : "Set"
          );
        }
        if (val[IS_STACK_SENTINEL]) {
          return printImmutableValues(
            val,
            config,
            indentation,
            depth,
            refs,
            printer,
            "Stack"
          );
        }
        if (val[IS_SEQ_SENTINEL]) {
          return printImmutableSeq(val, config, indentation, depth, refs, printer);
        }
        return printImmutableRecord(val, config, indentation, depth, refs, printer);
      };
      exports.serialize = serialize;
      var test = (val) => val && (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
      exports.test = test;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/react-is/cjs/react-is.development.js
  var require_react_is_development = __commonJS({
    "node_modules/react-is/cjs/react-is.development.js"(exports) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          var REACT_ELEMENT_TYPE = 60103;
          var REACT_PORTAL_TYPE = 60106;
          var REACT_FRAGMENT_TYPE = 60107;
          var REACT_STRICT_MODE_TYPE = 60108;
          var REACT_PROFILER_TYPE = 60114;
          var REACT_PROVIDER_TYPE = 60109;
          var REACT_CONTEXT_TYPE = 60110;
          var REACT_FORWARD_REF_TYPE = 60112;
          var REACT_SUSPENSE_TYPE = 60113;
          var REACT_SUSPENSE_LIST_TYPE = 60120;
          var REACT_MEMO_TYPE = 60115;
          var REACT_LAZY_TYPE = 60116;
          var REACT_BLOCK_TYPE = 60121;
          var REACT_SERVER_BLOCK_TYPE = 60122;
          var REACT_FUNDAMENTAL_TYPE = 60117;
          var REACT_SCOPE_TYPE = 60119;
          var REACT_OPAQUE_ID_TYPE = 60128;
          var REACT_DEBUG_TRACING_MODE_TYPE = 60129;
          var REACT_OFFSCREEN_TYPE = 60130;
          var REACT_LEGACY_HIDDEN_TYPE = 60131;
          if (typeof Symbol === "function" && Symbol.for) {
            var symbolFor = Symbol.for;
            REACT_ELEMENT_TYPE = symbolFor("react.element");
            REACT_PORTAL_TYPE = symbolFor("react.portal");
            REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
            REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
            REACT_PROFILER_TYPE = symbolFor("react.profiler");
            REACT_PROVIDER_TYPE = symbolFor("react.provider");
            REACT_CONTEXT_TYPE = symbolFor("react.context");
            REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
            REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
            REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
            REACT_MEMO_TYPE = symbolFor("react.memo");
            REACT_LAZY_TYPE = symbolFor("react.lazy");
            REACT_BLOCK_TYPE = symbolFor("react.block");
            REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block");
            REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental");
            REACT_SCOPE_TYPE = symbolFor("react.scope");
            REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
            REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
            REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
            REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
          }
          var enableScopeAPI = false;
          function isValidElementType(type) {
            if (typeof type === "string" || typeof type === "function") {
              return true;
            }
            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI) {
              return true;
            }
            if (typeof type === "object" && type !== null) {
              if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
                return true;
              }
            }
            return false;
          }
          function typeOf(object) {
            if (typeof object === "object" && object !== null) {
              var $$typeof = object.$$typeof;
              switch ($$typeof) {
                case REACT_ELEMENT_TYPE:
                  var type = object.type;
                  switch (type) {
                    case REACT_FRAGMENT_TYPE:
                    case REACT_PROFILER_TYPE:
                    case REACT_STRICT_MODE_TYPE:
                    case REACT_SUSPENSE_TYPE:
                    case REACT_SUSPENSE_LIST_TYPE:
                      return type;
                    default:
                      var $$typeofType = type && type.$$typeof;
                      switch ($$typeofType) {
                        case REACT_CONTEXT_TYPE:
                        case REACT_FORWARD_REF_TYPE:
                        case REACT_LAZY_TYPE:
                        case REACT_MEMO_TYPE:
                        case REACT_PROVIDER_TYPE:
                          return $$typeofType;
                        default:
                          return $$typeof;
                      }
                  }
                case REACT_PORTAL_TYPE:
                  return $$typeof;
              }
            }
            return void 0;
          }
          var ContextConsumer = REACT_CONTEXT_TYPE;
          var ContextProvider = REACT_PROVIDER_TYPE;
          var Element = REACT_ELEMENT_TYPE;
          var ForwardRef = REACT_FORWARD_REF_TYPE;
          var Fragment = REACT_FRAGMENT_TYPE;
          var Lazy = REACT_LAZY_TYPE;
          var Memo = REACT_MEMO_TYPE;
          var Portal = REACT_PORTAL_TYPE;
          var Profiler = REACT_PROFILER_TYPE;
          var StrictMode = REACT_STRICT_MODE_TYPE;
          var Suspense = REACT_SUSPENSE_TYPE;
          var hasWarnedAboutDeprecatedIsAsyncMode = false;
          var hasWarnedAboutDeprecatedIsConcurrentMode = false;
          function isAsyncMode(object) {
            {
              if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                hasWarnedAboutDeprecatedIsAsyncMode = true;
                console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.");
              }
            }
            return false;
          }
          function isConcurrentMode(object) {
            {
              if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
                hasWarnedAboutDeprecatedIsConcurrentMode = true;
                console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.");
              }
            }
            return false;
          }
          function isContextConsumer(object) {
            return typeOf(object) === REACT_CONTEXT_TYPE;
          }
          function isContextProvider(object) {
            return typeOf(object) === REACT_PROVIDER_TYPE;
          }
          function isElement(object) {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
          function isForwardRef(object) {
            return typeOf(object) === REACT_FORWARD_REF_TYPE;
          }
          function isFragment(object) {
            return typeOf(object) === REACT_FRAGMENT_TYPE;
          }
          function isLazy(object) {
            return typeOf(object) === REACT_LAZY_TYPE;
          }
          function isMemo(object) {
            return typeOf(object) === REACT_MEMO_TYPE;
          }
          function isPortal(object) {
            return typeOf(object) === REACT_PORTAL_TYPE;
          }
          function isProfiler(object) {
            return typeOf(object) === REACT_PROFILER_TYPE;
          }
          function isStrictMode(object) {
            return typeOf(object) === REACT_STRICT_MODE_TYPE;
          }
          function isSuspense(object) {
            return typeOf(object) === REACT_SUSPENSE_TYPE;
          }
          exports.ContextConsumer = ContextConsumer;
          exports.ContextProvider = ContextProvider;
          exports.Element = Element;
          exports.ForwardRef = ForwardRef;
          exports.Fragment = Fragment;
          exports.Lazy = Lazy;
          exports.Memo = Memo;
          exports.Portal = Portal;
          exports.Profiler = Profiler;
          exports.StrictMode = StrictMode;
          exports.Suspense = Suspense;
          exports.isAsyncMode = isAsyncMode;
          exports.isConcurrentMode = isConcurrentMode;
          exports.isContextConsumer = isContextConsumer;
          exports.isContextProvider = isContextProvider;
          exports.isElement = isElement;
          exports.isForwardRef = isForwardRef;
          exports.isFragment = isFragment;
          exports.isLazy = isLazy;
          exports.isMemo = isMemo;
          exports.isPortal = isPortal;
          exports.isProfiler = isProfiler;
          exports.isStrictMode = isStrictMode;
          exports.isSuspense = isSuspense;
          exports.isValidElementType = isValidElementType;
          exports.typeOf = typeOf;
        })();
      }
    }
  });

  // node_modules/react-is/index.js
  var require_react_is = __commonJS({
    "node_modules/react-is/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_is_development();
      }
    }
  });

  // node_modules/pretty-format/build/plugins/ReactElement.js
  var require_ReactElement = __commonJS({
    "node_modules/pretty-format/build/plugins/ReactElement.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var ReactIs = _interopRequireWildcard(require_react_is());
      var _markup = require_markup();
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      var getChildren = (arg, children = []) => {
        if (Array.isArray(arg)) {
          arg.forEach((item) => {
            getChildren(item, children);
          });
        } else if (arg != null && arg !== false) {
          children.push(arg);
        }
        return children;
      };
      var getType = (element) => {
        const type = element.type;
        if (typeof type === "string") {
          return type;
        }
        if (typeof type === "function") {
          return type.displayName || type.name || "Unknown";
        }
        if (ReactIs.isFragment(element)) {
          return "React.Fragment";
        }
        if (ReactIs.isSuspense(element)) {
          return "React.Suspense";
        }
        if (typeof type === "object" && type !== null) {
          if (ReactIs.isContextProvider(element)) {
            return "Context.Provider";
          }
          if (ReactIs.isContextConsumer(element)) {
            return "Context.Consumer";
          }
          if (ReactIs.isForwardRef(element)) {
            if (type.displayName) {
              return type.displayName;
            }
            const functionName = type.render.displayName || type.render.name || "";
            return functionName !== "" ? "ForwardRef(" + functionName + ")" : "ForwardRef";
          }
          if (ReactIs.isMemo(element)) {
            const functionName = type.displayName || type.type.displayName || type.type.name || "";
            return functionName !== "" ? "Memo(" + functionName + ")" : "Memo";
          }
        }
        return "UNDEFINED";
      };
      var getPropKeys = (element) => {
        const { props } = element;
        return Object.keys(props).filter((key) => key !== "children" && props[key] !== void 0).sort();
      };
      var serialize = (element, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? (0, _markup.printElementAsLeaf)(getType(element), config) : (0, _markup.printElement)(
        getType(element),
        (0, _markup.printProps)(
          getPropKeys(element),
          element.props,
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        (0, _markup.printChildren)(
          getChildren(element.props.children),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        config,
        indentation
      );
      exports.serialize = serialize;
      var test = (val) => val != null && ReactIs.isElement(val);
      exports.test = test;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/pretty-format/build/plugins/ReactTestComponent.js
  var require_ReactTestComponent = __commonJS({
    "node_modules/pretty-format/build/plugins/ReactTestComponent.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = exports.serialize = exports.default = void 0;
      var _markup = require_markup();
      var global = (function() {
        if (typeof globalThis !== "undefined") {
          return globalThis;
        } else if (typeof global !== "undefined") {
          return global;
        } else if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else {
          return Function("return this")();
        }
      })();
      var Symbol2 = global["jest-symbol-do-not-touch"] || global.Symbol;
      var testSymbol = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("react.test.json") : 245830487;
      var getPropKeys = (object) => {
        const { props } = object;
        return props ? Object.keys(props).filter((key) => props[key] !== void 0).sort() : [];
      };
      var serialize = (object, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? (0, _markup.printElementAsLeaf)(object.type, config) : (0, _markup.printElement)(
        object.type,
        object.props ? (0, _markup.printProps)(
          getPropKeys(object),
          object.props,
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ) : "",
        object.children ? (0, _markup.printChildren)(
          object.children,
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ) : "",
        config,
        indentation
      );
      exports.serialize = serialize;
      var test = (val) => val && val.$$typeof === testSymbol;
      exports.test = test;
      var plugin = {
        serialize,
        test
      };
      var _default = plugin;
      exports.default = _default;
    }
  });

  // node_modules/pretty-format/build/index.js
  var require_build = __commonJS({
    "node_modules/pretty-format/build/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = exports.DEFAULT_OPTIONS = void 0;
      exports.format = format;
      exports.plugins = void 0;
      var _ansiStyles = _interopRequireDefault(require_ansi_styles());
      var _collections = require_collections();
      var _AsymmetricMatcher = _interopRequireDefault(
        require_AsymmetricMatcher()
      );
      var _ConvertAnsi = _interopRequireDefault(require_ConvertAnsi());
      var _DOMCollection = _interopRequireDefault(require_DOMCollection());
      var _DOMElement = _interopRequireDefault(require_DOMElement());
      var _Immutable = _interopRequireDefault(require_Immutable());
      var _ReactElement = _interopRequireDefault(require_ReactElement());
      var _ReactTestComponent = _interopRequireDefault(
        require_ReactTestComponent()
      );
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var toString = Object.prototype.toString;
      var toISOString = Date.prototype.toISOString;
      var errorToString = Error.prototype.toString;
      var regExpToString = RegExp.prototype.toString;
      var getConstructorName = (val) => typeof val.constructor === "function" && val.constructor.name || "Object";
      var isWindow = (val) => typeof window !== "undefined" && val === window;
      var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
      var NEWLINE_REGEXP = /\n/gi;
      var PrettyFormatPluginError = class extends Error {
        constructor(message, stack) {
          super(message);
          this.stack = stack;
          this.name = this.constructor.name;
        }
      };
      function isToStringedArrayType(toStringed) {
        return toStringed === "[object Array]" || toStringed === "[object ArrayBuffer]" || toStringed === "[object DataView]" || toStringed === "[object Float32Array]" || toStringed === "[object Float64Array]" || toStringed === "[object Int8Array]" || toStringed === "[object Int16Array]" || toStringed === "[object Int32Array]" || toStringed === "[object Uint8Array]" || toStringed === "[object Uint8ClampedArray]" || toStringed === "[object Uint16Array]" || toStringed === "[object Uint32Array]";
      }
      function printNumber(val) {
        return Object.is(val, -0) ? "-0" : String(val);
      }
      function printBigInt(val) {
        return String(`${val}n`);
      }
      function printFunction(val, printFunctionName) {
        if (!printFunctionName) {
          return "[Function]";
        }
        return "[Function " + (val.name || "anonymous") + "]";
      }
      function printSymbol(val) {
        return String(val).replace(SYMBOL_REGEXP, "Symbol($1)");
      }
      function printError(val) {
        return "[" + errorToString.call(val) + "]";
      }
      function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
        if (val === true || val === false) {
          return "" + val;
        }
        if (val === void 0) {
          return "undefined";
        }
        if (val === null) {
          return "null";
        }
        const typeOf = typeof val;
        if (typeOf === "number") {
          return printNumber(val);
        }
        if (typeOf === "bigint") {
          return printBigInt(val);
        }
        if (typeOf === "string") {
          if (escapeString) {
            return '"' + val.replace(/"|\\/g, "\\$&") + '"';
          }
          return '"' + val + '"';
        }
        if (typeOf === "function") {
          return printFunction(val, printFunctionName);
        }
        if (typeOf === "symbol") {
          return printSymbol(val);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object WeakMap]") {
          return "WeakMap {}";
        }
        if (toStringed === "[object WeakSet]") {
          return "WeakSet {}";
        }
        if (toStringed === "[object Function]" || toStringed === "[object GeneratorFunction]") {
          return printFunction(val, printFunctionName);
        }
        if (toStringed === "[object Symbol]") {
          return printSymbol(val);
        }
        if (toStringed === "[object Date]") {
          return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
        }
        if (toStringed === "[object Error]") {
          return printError(val);
        }
        if (toStringed === "[object RegExp]") {
          if (escapeRegex) {
            return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
          }
          return regExpToString.call(val);
        }
        if (val instanceof Error) {
          return printError(val);
        }
        return null;
      }
      function printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON) {
        if (refs.indexOf(val) !== -1) {
          return "[Circular]";
        }
        refs = refs.slice();
        refs.push(val);
        const hitMaxDepth = ++depth > config.maxDepth;
        const min = config.min;
        if (config.callToJSON && !hitMaxDepth && val.toJSON && typeof val.toJSON === "function" && !hasCalledToJSON) {
          return printer(val.toJSON(), config, indentation, depth, refs, true);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object Arguments]") {
          return hitMaxDepth ? "[Arguments]" : (min ? "" : "Arguments ") + "[" + (0, _collections.printListItems)(
            val,
            config,
            indentation,
            depth,
            refs,
            printer
          ) + "]";
        }
        if (isToStringedArrayType(toStringed)) {
          return hitMaxDepth ? "[" + val.constructor.name + "]" : (min ? "" : !config.printBasicPrototype && val.constructor.name === "Array" ? "" : val.constructor.name + " ") + "[" + (0, _collections.printListItems)(
            val,
            config,
            indentation,
            depth,
            refs,
            printer
          ) + "]";
        }
        if (toStringed === "[object Map]") {
          return hitMaxDepth ? "[Map]" : "Map {" + (0, _collections.printIteratorEntries)(
            val.entries(),
            config,
            indentation,
            depth,
            refs,
            printer,
            " => "
          ) + "}";
        }
        if (toStringed === "[object Set]") {
          return hitMaxDepth ? "[Set]" : "Set {" + (0, _collections.printIteratorValues)(
            val.values(),
            config,
            indentation,
            depth,
            refs,
            printer
          ) + "}";
        }
        return hitMaxDepth || isWindow(val) ? "[" + getConstructorName(val) + "]" : (min ? "" : !config.printBasicPrototype && getConstructorName(val) === "Object" ? "" : getConstructorName(val) + " ") + "{" + (0, _collections.printObjectProperties)(
          val,
          config,
          indentation,
          depth,
          refs,
          printer
        ) + "}";
      }
      function isNewPlugin(plugin) {
        return plugin.serialize != null;
      }
      function printPlugin(plugin, val, config, indentation, depth, refs) {
        let printed;
        try {
          printed = isNewPlugin(plugin) ? plugin.serialize(val, config, indentation, depth, refs, printer) : plugin.print(
            val,
            (valChild) => printer(valChild, config, indentation, depth, refs),
            (str) => {
              const indentationNext = indentation + config.indent;
              return indentationNext + str.replace(NEWLINE_REGEXP, "\n" + indentationNext);
            },
            {
              edgeSpacing: config.spacingOuter,
              min: config.min,
              spacing: config.spacingInner
            },
            config.colors
          );
        } catch (error) {
          throw new PrettyFormatPluginError(error.message, error.stack);
        }
        if (typeof printed !== "string") {
          throw new Error(
            `pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`
          );
        }
        return printed;
      }
      function findPlugin(plugins2, val) {
        for (let p = 0; p < plugins2.length; p++) {
          try {
            if (plugins2[p].test(val)) {
              return plugins2[p];
            }
          } catch (error) {
            throw new PrettyFormatPluginError(error.message, error.stack);
          }
        }
        return null;
      }
      function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
        const plugin = findPlugin(config.plugins, val);
        if (plugin !== null) {
          return printPlugin(plugin, val, config, indentation, depth, refs);
        }
        const basicResult = printBasicValue(
          val,
          config.printFunctionName,
          config.escapeRegex,
          config.escapeString
        );
        if (basicResult !== null) {
          return basicResult;
        }
        return printComplexValue(
          val,
          config,
          indentation,
          depth,
          refs,
          hasCalledToJSON
        );
      }
      var DEFAULT_THEME = {
        comment: "gray",
        content: "reset",
        prop: "yellow",
        tag: "cyan",
        value: "green"
      };
      var DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
      var DEFAULT_OPTIONS = {
        callToJSON: true,
        compareKeys: void 0,
        escapeRegex: false,
        escapeString: true,
        highlight: false,
        indent: 2,
        maxDepth: Infinity,
        min: false,
        plugins: [],
        printBasicPrototype: true,
        printFunctionName: true,
        theme: DEFAULT_THEME
      };
      exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
      function validateOptions(options) {
        Object.keys(options).forEach((key) => {
          if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
            throw new Error(`pretty-format: Unknown option "${key}".`);
          }
        });
        if (options.min && options.indent !== void 0 && options.indent !== 0) {
          throw new Error(
            'pretty-format: Options "min" and "indent" cannot be used together.'
          );
        }
        if (options.theme !== void 0) {
          if (options.theme === null) {
            throw new Error('pretty-format: Option "theme" must not be null.');
          }
          if (typeof options.theme !== "object") {
            throw new Error(
              `pretty-format: Option "theme" must be of type "object" but instead received "${typeof options.theme}".`
            );
          }
        }
      }
      var getColorsHighlight = (options) => DEFAULT_THEME_KEYS.reduce((colors, key) => {
        const value = options.theme && options.theme[key] !== void 0 ? options.theme[key] : DEFAULT_THEME[key];
        const color = value && _ansiStyles.default[value];
        if (color && typeof color.close === "string" && typeof color.open === "string") {
          colors[key] = color;
        } else {
          throw new Error(
            `pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`
          );
        }
        return colors;
      }, /* @__PURE__ */ Object.create(null));
      var getColorsEmpty = () => DEFAULT_THEME_KEYS.reduce((colors, key) => {
        colors[key] = {
          close: "",
          open: ""
        };
        return colors;
      }, /* @__PURE__ */ Object.create(null));
      var getPrintFunctionName = (options) => options && options.printFunctionName !== void 0 ? options.printFunctionName : DEFAULT_OPTIONS.printFunctionName;
      var getEscapeRegex = (options) => options && options.escapeRegex !== void 0 ? options.escapeRegex : DEFAULT_OPTIONS.escapeRegex;
      var getEscapeString = (options) => options && options.escapeString !== void 0 ? options.escapeString : DEFAULT_OPTIONS.escapeString;
      var getConfig = (options) => {
        var _options$printBasicPr;
        return {
          callToJSON: options && options.callToJSON !== void 0 ? options.callToJSON : DEFAULT_OPTIONS.callToJSON,
          colors: options && options.highlight ? getColorsHighlight(options) : getColorsEmpty(),
          compareKeys: options && typeof options.compareKeys === "function" ? options.compareKeys : DEFAULT_OPTIONS.compareKeys,
          escapeRegex: getEscapeRegex(options),
          escapeString: getEscapeString(options),
          indent: options && options.min ? "" : createIndent(
            options && options.indent !== void 0 ? options.indent : DEFAULT_OPTIONS.indent
          ),
          maxDepth: options && options.maxDepth !== void 0 ? options.maxDepth : DEFAULT_OPTIONS.maxDepth,
          min: options && options.min !== void 0 ? options.min : DEFAULT_OPTIONS.min,
          plugins: options && options.plugins !== void 0 ? options.plugins : DEFAULT_OPTIONS.plugins,
          printBasicPrototype: (_options$printBasicPr = options === null || options === void 0 ? void 0 : options.printBasicPrototype) !== null && _options$printBasicPr !== void 0 ? _options$printBasicPr : true,
          printFunctionName: getPrintFunctionName(options),
          spacingInner: options && options.min ? " " : "\n",
          spacingOuter: options && options.min ? "" : "\n"
        };
      };
      function createIndent(indent) {
        return new Array(indent + 1).join(" ");
      }
      function format(val, options) {
        if (options) {
          validateOptions(options);
          if (options.plugins) {
            const plugin = findPlugin(options.plugins, val);
            if (plugin !== null) {
              return printPlugin(plugin, val, getConfig(options), "", 0, []);
            }
          }
        }
        const basicResult = printBasicValue(
          val,
          getPrintFunctionName(options),
          getEscapeRegex(options),
          getEscapeString(options)
        );
        if (basicResult !== null) {
          return basicResult;
        }
        return printComplexValue(val, getConfig(options), "", 0, []);
      }
      var plugins = {
        AsymmetricMatcher: _AsymmetricMatcher.default,
        ConvertAnsi: _ConvertAnsi.default,
        DOMCollection: _DOMCollection.default,
        DOMElement: _DOMElement.default,
        Immutable: _Immutable.default,
        ReactElement: _ReactElement.default,
        ReactTestComponent: _ReactTestComponent.default
      };
      exports.plugins = plugins;
      var _default = format;
      exports.default = _default;
    }
  });

  // node_modules/@testing-library/dom/dist/DOMElementFilter.js
  var require_DOMElementFilter = __commonJS({
    "node_modules/@testing-library/dom/dist/DOMElementFilter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = createDOMElementFilter;
      exports.test = void 0;
      function escapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      var printProps = (keys, props, config, indentation, depth, refs, printer) => {
        const indentationNext = indentation + config.indent;
        const colors = config.colors;
        return keys.map((key) => {
          const value = props[key];
          let printed = printer(value, config, indentationNext, depth, refs);
          if (typeof value !== "string") {
            if (printed.indexOf("\n") !== -1) {
              printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
            }
            printed = "{" + printed + "}";
          }
          return config.spacingInner + indentation + colors.prop.open + key + colors.prop.close + "=" + colors.value.open + printed + colors.value.close;
        }).join("");
      };
      var NodeTypeTextNode = 3;
      var printChildren = (children, config, indentation, depth, refs, printer) => children.map((child) => {
        const printedChild = typeof child === "string" ? printText(child, config) : printer(child, config, indentation, depth, refs);
        if (printedChild === "" && typeof child === "object" && child !== null && child.nodeType !== NodeTypeTextNode) {
          return "";
        }
        return config.spacingOuter + indentation + printedChild;
      }).join("");
      var printText = (text, config) => {
        const contentColor = config.colors.content;
        return contentColor.open + escapeHTML(text) + contentColor.close;
      };
      var printComment = (comment, config) => {
        const commentColor = config.colors.comment;
        return commentColor.open + "<!--" + escapeHTML(comment) + "-->" + commentColor.close;
      };
      var printElement = (type, printedProps, printedChildren, config, indentation) => {
        const tagColor = config.colors.tag;
        return tagColor.open + "<" + type + (printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open) + (printedChildren ? ">" + tagColor.close + printedChildren + config.spacingOuter + indentation + tagColor.open + "</" + type : (printedProps && !config.min ? "" : " ") + "/") + ">" + tagColor.close;
      };
      var printElementAsLeaf = (type, config) => {
        const tagColor = config.colors.tag;
        return tagColor.open + "<" + type + tagColor.close + " \u2026" + tagColor.open + " />" + tagColor.close;
      };
      var ELEMENT_NODE = 1;
      var TEXT_NODE = 3;
      var COMMENT_NODE = 8;
      var FRAGMENT_NODE = 11;
      var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
      var isCustomElement = (val) => {
        const {
          tagName
        } = val;
        return Boolean(typeof tagName === "string" && tagName.includes("-") || typeof val.hasAttribute === "function" && val.hasAttribute("is"));
      };
      var testNode = (val) => {
        const constructorName = val.constructor.name;
        const {
          nodeType
        } = val;
        return nodeType === ELEMENT_NODE && (ELEMENT_REGEXP.test(constructorName) || isCustomElement(val)) || nodeType === TEXT_NODE && constructorName === "Text" || nodeType === COMMENT_NODE && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
      };
      var test = (val) => (val?.constructor?.name || isCustomElement(val)) && testNode(val);
      exports.test = test;
      function nodeIsText(node) {
        return node.nodeType === TEXT_NODE;
      }
      function nodeIsComment(node) {
        return node.nodeType === COMMENT_NODE;
      }
      function nodeIsFragment(node) {
        return node.nodeType === FRAGMENT_NODE;
      }
      function createDOMElementFilter(filterNode) {
        return {
          test: (val) => (val?.constructor?.name || isCustomElement(val)) && testNode(val),
          serialize: (node, config, indentation, depth, refs, printer) => {
            if (nodeIsText(node)) {
              return printText(node.data, config);
            }
            if (nodeIsComment(node)) {
              return printComment(node.data, config);
            }
            const type = nodeIsFragment(node) ? `DocumentFragment` : node.tagName.toLowerCase();
            if (++depth > config.maxDepth) {
              return printElementAsLeaf(type, config);
            }
            return printElement(type, printProps(nodeIsFragment(node) ? [] : Array.from(node.attributes).map((attr) => attr.name).sort(), nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce((props, attribute) => {
              props[attribute.name] = attribute.value;
              return props;
            }, {}), config, indentation + config.indent, depth, refs, printer), printChildren(Array.prototype.slice.call(node.childNodes || node.children).filter(filterNode), config, indentation + config.indent, depth, refs, printer), config, indentation);
          }
        };
      }
    }
  });

  // node_modules/@testing-library/dom/dist/get-user-code-frame.js
  var require_get_user_code_frame = __commonJS({
    "node_modules/@testing-library/dom/dist/get-user-code-frame.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getUserCodeFrame = getUserCodeFrame;
      var picocolors = null;
      var readFileSync = null;
      var codeFrameColumns = null;
      try {
        const nodeRequire = module && module.require;
        readFileSync = nodeRequire.call(module, "fs").readFileSync;
        codeFrameColumns = nodeRequire.call(module, "@babel/code-frame").codeFrameColumns;
        picocolors = nodeRequire.call(module, "picocolors");
      } catch {
      }
      function getCodeFrame(frame) {
        const locationStart = frame.indexOf("(") + 1;
        const locationEnd = frame.indexOf(")");
        const frameLocation = frame.slice(locationStart, locationEnd);
        const frameLocationElements = frameLocation.split(":");
        const [filename, line, column] = [frameLocationElements[0], parseInt(frameLocationElements[1], 10), parseInt(frameLocationElements[2], 10)];
        let rawFileContents = "";
        try {
          rawFileContents = readFileSync(filename, "utf-8");
        } catch {
          return "";
        }
        const codeFrame = codeFrameColumns(rawFileContents, {
          start: {
            line,
            column
          }
        }, {
          highlightCode: true,
          linesBelow: 0
        });
        return `${picocolors.dim(frameLocation)}
${codeFrame}
`;
      }
      function getUserCodeFrame() {
        if (!readFileSync || !codeFrameColumns) {
          return "";
        }
        const err = new Error();
        const firstClientCodeFrame = err.stack.split("\n").slice(1).find((frame) => !frame.includes("node_modules/"));
        return getCodeFrame(firstClientCodeFrame);
      }
    }
  });

  // node_modules/@testing-library/dom/dist/helpers.js
  var require_helpers = __commonJS({
    "node_modules/@testing-library/dom/dist/helpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.TEXT_NODE = void 0;
      exports.checkContainerType = checkContainerType;
      exports.getDocument = getDocument;
      exports.getWindowFromNode = getWindowFromNode;
      exports.jestFakeTimersAreEnabled = jestFakeTimersAreEnabled;
      var TEXT_NODE = exports.TEXT_NODE = 3;
      function jestFakeTimersAreEnabled() {
        if (typeof jest !== "undefined" && jest !== null) {
          return (
            // legacy timers
            setTimeout._isMockFunction === true || // modern timers
            // eslint-disable-next-line prefer-object-has-own -- not supported by our support matrix
            Object.prototype.hasOwnProperty.call(setTimeout, "clock")
          );
        }
        return false;
      }
      function getDocument() {
        if (typeof window === "undefined") {
          throw new Error("Could not find default container");
        }
        return window.document;
      }
      function getWindowFromNode(node) {
        if (node.defaultView) {
          return node.defaultView;
        } else if (node.ownerDocument && node.ownerDocument.defaultView) {
          return node.ownerDocument.defaultView;
        } else if (node.window) {
          return node.window;
        } else if (node.ownerDocument && node.ownerDocument.defaultView === null) {
          throw new Error(`It looks like the window object is not available for the provided node.`);
        } else if (node.then instanceof Function) {
          throw new Error(`It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?`);
        } else if (Array.isArray(node)) {
          throw new Error(`It looks like you passed an Array instead of a DOM node. Did you do something like \`fireEvent.click(screen.getAllBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`?`);
        } else if (typeof node.debug === "function" && typeof node.logTestingPlaygroundURL === "function") {
          throw new Error(`It looks like you passed a \`screen\` object. Did you do something like \`fireEvent.click(screen, ...\` when you meant to use a query, e.g. \`fireEvent.click(screen.getBy..., \`?`);
        } else {
          throw new Error(`The given node is not an Element, the node type is: ${typeof node}.`);
        }
      }
      function checkContainerType(container) {
        if (!container || !(typeof container.querySelector === "function") || !(typeof container.querySelectorAll === "function")) {
          throw new TypeError(`Expected container to be an Element, a Document or a DocumentFragment but got ${getTypeName(container)}.`);
        }
        function getTypeName(object) {
          if (typeof object === "object") {
            return object === null ? "null" : object.constructor.name;
          }
          return typeof object;
        }
      }
    }
  });

  // node_modules/@testing-library/dom/dist/pretty-dom.js
  var require_pretty_dom = __commonJS({
    "node_modules/@testing-library/dom/dist/pretty-dom.js"(exports) {
      "use strict";
      var _interopRequireDefault = require_interopRequireDefault();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.logDOM = void 0;
      exports.prettyDOM = prettyDOM;
      exports.prettyFormat = void 0;
      var prettyFormat = _interopRequireWildcard(require_build());
      exports.prettyFormat = prettyFormat;
      var _DOMElementFilter = _interopRequireDefault(require_DOMElementFilter());
      var _getUserCodeFrame = require_get_user_code_frame();
      var _helpers = require_helpers();
      var _config = require_config();
      function _interopRequireWildcard(e, t) {
        if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (_interopRequireWildcard = function(e2, t2) {
          if (!t2 && e2 && e2.__esModule) return e2;
          var o, i, f = { __proto__: null, default: e2 };
          if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
          if (o = t2 ? n : r) {
            if (o.has(e2)) return o.get(e2);
            o.set(e2, f);
          }
          for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
          return f;
        })(e, t);
      }
      var shouldHighlight = () => {
        if (typeof process === "undefined") {
          return false;
        }
        let colors;
        try {
          const colorsJSON = process.env?.COLORS;
          if (colorsJSON) {
            colors = JSON.parse(colorsJSON);
          }
        } catch {
        }
        if (typeof colors === "boolean") {
          return colors;
        } else {
          return process.versions !== void 0 && process.versions.node !== void 0;
        }
      };
      var {
        DOMCollection
      } = prettyFormat.plugins;
      var ELEMENT_NODE = 1;
      var COMMENT_NODE = 8;
      function filterCommentsAndDefaultIgnoreTagsTags(value) {
        return value.nodeType !== COMMENT_NODE && (value.nodeType !== ELEMENT_NODE || !value.matches((0, _config.getConfig)().defaultIgnore));
      }
      function prettyDOM(dom, maxLength, options = {}) {
        if (!dom) {
          dom = (0, _helpers.getDocument)().body;
        }
        if (typeof maxLength !== "number") {
          maxLength = typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.DEBUG_PRINT_LIMIT || 7e3;
        }
        if (maxLength === 0) {
          return "";
        }
        if (dom.documentElement) {
          dom = dom.documentElement;
        }
        let domTypeName = typeof dom;
        if (domTypeName === "object") {
          domTypeName = dom.constructor.name;
        } else {
          dom = {};
        }
        if (!("outerHTML" in dom)) {
          throw new TypeError(`Expected an element or document but got ${domTypeName}`);
        }
        const {
          filterNode = filterCommentsAndDefaultIgnoreTagsTags,
          ...prettyFormatOptions
        } = options;
        const debugContent = prettyFormat.format(dom, {
          plugins: [(0, _DOMElementFilter.default)(filterNode), DOMCollection],
          printFunctionName: false,
          highlight: shouldHighlight(),
          ...prettyFormatOptions
        });
        return maxLength !== void 0 && dom.outerHTML.length > maxLength ? `${debugContent.slice(0, maxLength)}...` : debugContent;
      }
      var logDOM = (...args) => {
        const userCodeFrame = (0, _getUserCodeFrame.getUserCodeFrame)();
        if (userCodeFrame) {
          console.log(`${prettyDOM(...args)}

${userCodeFrame}`);
        } else {
          console.log(prettyDOM(...args));
        }
      };
      exports.logDOM = logDOM;
    }
  });

  // node_modules/@testing-library/dom/dist/config.js
  var require_config = __commonJS({
    "node_modules/@testing-library/dom/dist/config.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.configure = configure;
      exports.getConfig = getConfig;
      exports.runWithExpensiveErrorDiagnosticsDisabled = runWithExpensiveErrorDiagnosticsDisabled;
      var _prettyDom = require_pretty_dom();
      var config = {
        testIdAttribute: "data-testid",
        asyncUtilTimeout: 1e3,
        // asyncWrapper and advanceTimersWrapper is to support React's async `act` function.
        // forcing react-testing-library to wrap all async functions would've been
        // a total nightmare (consider wrapping every findBy* query and then also
        // updating `within` so those would be wrapped too. Total nightmare).
        // so we have this config option that's really only intended for
        // react-testing-library to use. For that reason, this feature will remain
        // undocumented.
        asyncWrapper: (cb) => cb(),
        unstable_advanceTimersWrapper: (cb) => cb(),
        eventWrapper: (cb) => cb(),
        // default value for the `hidden` option in `ByRole` queries
        defaultHidden: false,
        // default value for the `ignore` option in `ByText` queries
        defaultIgnore: "script, style",
        // showOriginalStackTrace flag to show the full error stack traces for async errors
        showOriginalStackTrace: false,
        // throw errors w/ suggestions for better queries. Opt in so off by default.
        throwSuggestions: false,
        // called when getBy* queries fail. (message, container) => Error
        getElementError(message, container) {
          const prettifiedDOM = (0, _prettyDom.prettyDOM)(container);
          const error = new Error([message, `Ignored nodes: comments, ${config.defaultIgnore}
${prettifiedDOM}`].filter(Boolean).join("\n\n"));
          error.name = "TestingLibraryElementError";
          return error;
        },
        _disableExpensiveErrorDiagnostics: false,
        computedStyleSupportsPseudoElements: false
      };
      function runWithExpensiveErrorDiagnosticsDisabled(callback) {
        try {
          config._disableExpensiveErrorDiagnostics = true;
          return callback();
        } finally {
          config._disableExpensiveErrorDiagnostics = false;
        }
      }
      function configure(newConfig) {
        if (typeof newConfig === "function") {
          newConfig = newConfig(config);
        }
        config = {
          ...config,
          ...newConfig
        };
      }
      function getConfig() {
        return config;
      }
    }
  });

  // node_modules/@testing-library/dom/dist/label-helpers.js
  var require_label_helpers = __commonJS({
    "node_modules/@testing-library/dom/dist/label-helpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getLabelContent = getLabelContent;
      exports.getLabels = getLabels;
      exports.getRealLabels = getRealLabels;
      var _helpers = require_helpers();
      var labelledNodeNames = ["button", "meter", "output", "progress", "select", "textarea", "input"];
      function getTextContent(node) {
        if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
          return "";
        }
        if (node.nodeType === _helpers.TEXT_NODE) return node.textContent;
        return Array.from(node.childNodes).map((childNode) => getTextContent(childNode)).join("");
      }
      function getLabelContent(element) {
        let textContent;
        if (element.tagName.toLowerCase() === "label") {
          textContent = getTextContent(element);
        } else {
          textContent = element.value || element.textContent;
        }
        return textContent;
      }
      function getRealLabels(element) {
        if (element.labels !== void 0) {
          return element.labels ?? [];
        }
        if (!isLabelable(element)) return [];
        const labels = element.ownerDocument.querySelectorAll("label");
        return Array.from(labels).filter((label) => label.control === element);
      }
      function isLabelable(element) {
        return /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/.test(element.tagName) || element.tagName === "INPUT" && element.getAttribute("type") !== "hidden";
      }
      function getLabels(container, element, {
        selector = "*"
      } = {}) {
        const ariaLabelledBy = element.getAttribute("aria-labelledby");
        const labelsId = ariaLabelledBy ? ariaLabelledBy.split(" ") : [];
        return labelsId.length ? labelsId.map((labelId) => {
          const labellingElement = container.querySelector(`[id="${labelId}"]`);
          return labellingElement ? {
            content: getLabelContent(labellingElement),
            formControl: null
          } : {
            content: "",
            formControl: null
          };
        }) : Array.from(getRealLabels(element)).map((label) => {
          const textToMatch = getLabelContent(label);
          const formControlSelector = "button, input, meter, output, progress, select, textarea";
          const labelledFormControl = Array.from(label.querySelectorAll(formControlSelector)).filter((formControlElement) => formControlElement.matches(selector))[0];
          return {
            content: textToMatch,
            formControl: labelledFormControl
          };
        });
      }
    }
  });

  // node_modules/@testing-library/dom/dist/matches.js
  var require_matches = __commonJS({
    "node_modules/@testing-library/dom/dist/matches.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.fuzzyMatches = fuzzyMatches;
      exports.getDefaultNormalizer = getDefaultNormalizer;
      exports.makeNormalizer = makeNormalizer;
      exports.matches = matches;
      function assertNotNullOrUndefined(matcher) {
        if (matcher === null || matcher === void 0) {
          throw new Error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- implicitly converting `T` to `string`
            `It looks like ${matcher} was passed instead of a matcher. Did you do something like getByText(${matcher})?`
          );
        }
      }
      function fuzzyMatches(textToMatch, node, matcher, normalizer) {
        if (typeof textToMatch !== "string") {
          return false;
        }
        assertNotNullOrUndefined(matcher);
        const normalizedText = normalizer(textToMatch);
        if (typeof matcher === "string" || typeof matcher === "number") {
          return normalizedText.toLowerCase().includes(matcher.toString().toLowerCase());
        } else if (typeof matcher === "function") {
          return matcher(normalizedText, node);
        } else {
          return matchRegExp(matcher, normalizedText);
        }
      }
      function matches(textToMatch, node, matcher, normalizer) {
        if (typeof textToMatch !== "string") {
          return false;
        }
        assertNotNullOrUndefined(matcher);
        const normalizedText = normalizer(textToMatch);
        if (matcher instanceof Function) {
          return matcher(normalizedText, node);
        } else if (matcher instanceof RegExp) {
          return matchRegExp(matcher, normalizedText);
        } else {
          return normalizedText === String(matcher);
        }
      }
      function getDefaultNormalizer({
        trim = true,
        collapseWhitespace = true
      } = {}) {
        return (text) => {
          let normalizedText = text;
          normalizedText = trim ? normalizedText.trim() : normalizedText;
          normalizedText = collapseWhitespace ? normalizedText.replace(/\s+/g, " ") : normalizedText;
          return normalizedText;
        };
      }
      function makeNormalizer({
        trim,
        collapseWhitespace,
        normalizer
      }) {
        if (!normalizer) {
          return getDefaultNormalizer({
            trim,
            collapseWhitespace
          });
        }
        if (typeof trim !== "undefined" || typeof collapseWhitespace !== "undefined") {
          throw new Error('trim and collapseWhitespace are not supported with a normalizer. If you want to use the default trim and collapseWhitespace logic in your normalizer, use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer');
        }
        return normalizer;
      }
      function matchRegExp(matcher, text) {
        const match = matcher.test(text);
        if (matcher.global && matcher.lastIndex !== 0) {
          console.warn(`To match all elements we had to reset the lastIndex of the RegExp because the global flag is enabled. We encourage to remove the global flag from the RegExp.`);
          matcher.lastIndex = 0;
        }
        return match;
      }
    }
  });

  // node_modules/@testing-library/dom/dist/get-node-text.js
  var require_get_node_text = __commonJS({
    "node_modules/@testing-library/dom/dist/get-node-text.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getNodeText = getNodeText;
      var _helpers = require_helpers();
      function getNodeText(node) {
        if (node.matches("input[type=submit], input[type=button], input[type=reset]")) {
          return node.value;
        }
        return Array.from(node.childNodes).filter((child) => child.nodeType === _helpers.TEXT_NODE && Boolean(child.textContent)).map((c) => c.textContent).join("");
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/polyfills/array.from.js
  var require_array_from = __commonJS({
    "node_modules/dom-accessibility-api/dist/polyfills/array.from.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = arrayFrom;
      var toStr = Object.prototype.toString;
      function isCallable(fn) {
        return typeof fn === "function" || toStr.call(fn) === "[object Function]";
      }
      function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      }
      var maxSafeInteger = Math.pow(2, 53) - 1;
      function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      }
      function arrayFrom(arrayLike, mapFn) {
        var C = Array;
        var items = Object(arrayLike);
        if (arrayLike == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }
        if (typeof mapFn !== "undefined") {
          if (!isCallable(mapFn)) {
            throw new TypeError("Array.from: when provided, the second argument must be a function");
          }
        }
        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        var k = 0;
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = mapFn(kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/polyfills/SetLike.js
  var require_SetLike = __commonJS({
    "node_modules/dom-accessibility-api/dist/polyfills/SetLike.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = void 0;
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      var SetLike = /* @__PURE__ */ (function() {
        function SetLike2() {
          var items = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
          _classCallCheck(this, SetLike2);
          _defineProperty(this, "items", void 0);
          this.items = items;
        }
        _createClass(SetLike2, [{
          key: "add",
          value: function add(value) {
            if (this.has(value) === false) {
              this.items.push(value);
            }
            return this;
          }
        }, {
          key: "clear",
          value: function clear() {
            this.items = [];
          }
        }, {
          key: "delete",
          value: function _delete(value) {
            var previousLength = this.items.length;
            this.items = this.items.filter(function(item) {
              return item !== value;
            });
            return previousLength !== this.items.length;
          }
        }, {
          key: "forEach",
          value: function forEach(callbackfn) {
            var _this = this;
            this.items.forEach(function(item) {
              callbackfn(item, item, _this);
            });
          }
        }, {
          key: "has",
          value: function has(value) {
            return this.items.indexOf(value) !== -1;
          }
        }, {
          key: "size",
          get: function get() {
            return this.items.length;
          }
        }]);
        return SetLike2;
      })();
      var _default = typeof Set === "undefined" ? Set : SetLike;
      exports.default = _default;
    }
  });

  // node_modules/dom-accessibility-api/dist/getRole.js
  var require_getRole = __commonJS({
    "node_modules/dom-accessibility-api/dist/getRole.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.default = getRole;
      exports.getLocalName = getLocalName;
      function getLocalName(element) {
        var _element$localName;
        return (
          // eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
          (_element$localName = element.localName) !== null && _element$localName !== void 0 ? _element$localName : (
            // eslint-disable-next-line no-restricted-properties -- required for the fallback
            element.tagName.toLowerCase()
          )
        );
      }
      var localNameToRoleMappings = {
        article: "article",
        aside: "complementary",
        button: "button",
        datalist: "listbox",
        dd: "definition",
        details: "group",
        dialog: "dialog",
        dt: "term",
        fieldset: "group",
        figure: "figure",
        // WARNING: Only with an accessible name
        form: "form",
        footer: "contentinfo",
        h1: "heading",
        h2: "heading",
        h3: "heading",
        h4: "heading",
        h5: "heading",
        h6: "heading",
        header: "banner",
        hr: "separator",
        html: "document",
        legend: "legend",
        li: "listitem",
        math: "math",
        main: "main",
        menu: "list",
        nav: "navigation",
        ol: "list",
        optgroup: "group",
        // WARNING: Only in certain context
        option: "option",
        output: "status",
        progress: "progressbar",
        // WARNING: Only with an accessible name
        section: "region",
        summary: "button",
        table: "table",
        tbody: "rowgroup",
        textarea: "textbox",
        tfoot: "rowgroup",
        // WARNING: Only in certain context
        td: "cell",
        th: "columnheader",
        thead: "rowgroup",
        tr: "row",
        ul: "list"
      };
      var prohibitedAttributes = {
        caption: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        code: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        deletion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        emphasis: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        generic: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
        insertion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        paragraph: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        presentation: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        strong: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        subscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
        superscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"])
      };
      function hasGlobalAriaAttributes(element, role) {
        return [
          "aria-atomic",
          "aria-busy",
          "aria-controls",
          "aria-current",
          "aria-describedby",
          "aria-details",
          // "disabled",
          "aria-dropeffect",
          // "errormessage",
          "aria-flowto",
          "aria-grabbed",
          // "haspopup",
          "aria-hidden",
          // "invalid",
          "aria-keyshortcuts",
          "aria-label",
          "aria-labelledby",
          "aria-live",
          "aria-owns",
          "aria-relevant",
          "aria-roledescription"
        ].some(function(attributeName) {
          var _prohibitedAttributes;
          return element.hasAttribute(attributeName) && !((_prohibitedAttributes = prohibitedAttributes[role]) !== null && _prohibitedAttributes !== void 0 && _prohibitedAttributes.has(attributeName));
        });
      }
      function ignorePresentationalRole(element, implicitRole) {
        return hasGlobalAriaAttributes(element, implicitRole);
      }
      function getRole(element) {
        var explicitRole = getExplicitRole(element);
        if (explicitRole === null || explicitRole === "presentation") {
          var implicitRole = getImplicitRole(element);
          if (explicitRole !== "presentation" || ignorePresentationalRole(element, implicitRole || "")) {
            return implicitRole;
          }
        }
        return explicitRole;
      }
      function getImplicitRole(element) {
        var mappedByTag = localNameToRoleMappings[getLocalName(element)];
        if (mappedByTag !== void 0) {
          return mappedByTag;
        }
        switch (getLocalName(element)) {
          case "a":
          case "area":
          case "link":
            if (element.hasAttribute("href")) {
              return "link";
            }
            break;
          case "img":
            if (element.getAttribute("alt") === "" && !ignorePresentationalRole(element, "img")) {
              return "presentation";
            }
            return "img";
          case "input": {
            var _ref = element, type = _ref.type;
            switch (type) {
              case "button":
              case "image":
              case "reset":
              case "submit":
                return "button";
              case "checkbox":
              case "radio":
                return type;
              case "range":
                return "slider";
              case "email":
              case "tel":
              case "text":
              case "url":
                if (element.hasAttribute("list")) {
                  return "combobox";
                }
                return "textbox";
              case "search":
                if (element.hasAttribute("list")) {
                  return "combobox";
                }
                return "searchbox";
              case "number":
                return "spinbutton";
              default:
                return null;
            }
          }
          case "select":
            if (element.hasAttribute("multiple") || element.size > 1) {
              return "listbox";
            }
            return "combobox";
        }
        return null;
      }
      function getExplicitRole(element) {
        var role = element.getAttribute("role");
        if (role !== null) {
          var explicitRole = role.trim().split(" ")[0];
          if (explicitRole.length > 0) {
            return explicitRole;
          }
        }
        return null;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/util.js
  var require_util = __commonJS({
    "node_modules/dom-accessibility-api/dist/util.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      exports.__esModule = true;
      exports.hasAnyConcreteRoles = hasAnyConcreteRoles;
      exports.isElement = isElement;
      exports.isHTMLFieldSetElement = isHTMLFieldSetElement;
      exports.isHTMLInputElement = isHTMLInputElement;
      exports.isHTMLLegendElement = isHTMLLegendElement;
      exports.isHTMLOptGroupElement = isHTMLOptGroupElement;
      exports.isHTMLSelectElement = isHTMLSelectElement;
      exports.isHTMLSlotElement = isHTMLSlotElement;
      exports.isHTMLTableCaptionElement = isHTMLTableCaptionElement;
      exports.isHTMLTableElement = isHTMLTableElement;
      exports.isHTMLTextAreaElement = isHTMLTextAreaElement;
      exports.isSVGElement = isSVGElement;
      exports.isSVGSVGElement = isSVGSVGElement;
      exports.isSVGTitleElement = isSVGTitleElement;
      exports.queryIdRefs = queryIdRefs;
      exports.safeWindow = safeWindow;
      var _getRole = _interopRequireWildcard(require_getRole());
      exports.getLocalName = _getRole.getLocalName;
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function") return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { default: obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function isElement(node) {
        return node !== null && node.nodeType === node.ELEMENT_NODE;
      }
      function isHTMLTableCaptionElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "caption";
      }
      function isHTMLInputElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "input";
      }
      function isHTMLOptGroupElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "optgroup";
      }
      function isHTMLSelectElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "select";
      }
      function isHTMLTableElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "table";
      }
      function isHTMLTextAreaElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "textarea";
      }
      function safeWindow(node) {
        var _ref = node.ownerDocument === null ? node : node.ownerDocument, defaultView = _ref.defaultView;
        if (defaultView === null) {
          throw new TypeError("no window available");
        }
        return defaultView;
      }
      function isHTMLFieldSetElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "fieldset";
      }
      function isHTMLLegendElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "legend";
      }
      function isHTMLSlotElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "slot";
      }
      function isSVGElement(node) {
        return isElement(node) && node.ownerSVGElement !== void 0;
      }
      function isSVGSVGElement(node) {
        return isElement(node) && (0, _getRole.getLocalName)(node) === "svg";
      }
      function isSVGTitleElement(node) {
        return isSVGElement(node) && (0, _getRole.getLocalName)(node) === "title";
      }
      function queryIdRefs(node, attributeName) {
        if (isElement(node) && node.hasAttribute(attributeName)) {
          var ids = node.getAttribute(attributeName).split(" ");
          var root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
          return ids.map(function(id) {
            return root.getElementById(id);
          }).filter(
            function(element) {
              return element !== null;
            }
            // TODO: why does this not narrow?
          );
        }
        return [];
      }
      function hasAnyConcreteRoles(node, roles) {
        if (isElement(node)) {
          return roles.indexOf((0, _getRole.default)(node)) !== -1;
        }
        return false;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-name-and-description.js
  var require_accessible_name_and_description = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-name-and-description.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeTextAlternative = computeTextAlternative;
      var _array = _interopRequireDefault(require_array_from());
      var _SetLike = _interopRequireDefault(require_SetLike());
      var _util = require_util();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function asFlatString(s) {
        return s.trim().replace(/\s\s+/g, " ");
      }
      function isHidden(node, getComputedStyleImplementation) {
        if (!(0, _util.isElement)(node)) {
          return false;
        }
        if (node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true") {
          return true;
        }
        var style = getComputedStyleImplementation(node);
        return style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden";
      }
      function isControl(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["button", "combobox", "listbox", "textbox"]) || hasAbstractRole(node, "range");
      }
      function hasAbstractRole(node, role) {
        if (!(0, _util.isElement)(node)) {
          return false;
        }
        switch (role) {
          case "range":
            return (0, _util.hasAnyConcreteRoles)(node, ["meter", "progressbar", "scrollbar", "slider", "spinbutton"]);
          default:
            throw new TypeError("No knowledge about abstract role '".concat(role, "'. This is likely a bug :("));
        }
      }
      function querySelectorAllSubtree(element, selectors) {
        var elements = (0, _array.default)(element.querySelectorAll(selectors));
        (0, _util.queryIdRefs)(element, "aria-owns").forEach(function(root) {
          elements.push.apply(elements, (0, _array.default)(root.querySelectorAll(selectors)));
        });
        return elements;
      }
      function querySelectedOptions(listbox) {
        if ((0, _util.isHTMLSelectElement)(listbox)) {
          return listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]");
        }
        return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
      }
      function isMarkedPresentational(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["none", "presentation"]);
      }
      function isNativeHostLanguageTextAlternativeElement(node) {
        return (0, _util.isHTMLTableCaptionElement)(node);
      }
      function allowsNameFromContent(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "label", "legend", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"]);
      }
      function isDescendantOfNativeHostLanguageTextAlternativeElement(node) {
        return false;
      }
      function getValueOfTextbox(element) {
        if ((0, _util.isHTMLInputElement)(element) || (0, _util.isHTMLTextAreaElement)(element)) {
          return element.value;
        }
        return element.textContent || "";
      }
      function getTextualContent(declaration) {
        var content = declaration.getPropertyValue("content");
        if (/^["'].*["']$/.test(content)) {
          return content.slice(1, -1);
        }
        return "";
      }
      function isLabelableElement(element) {
        var localName = (0, _util.getLocalName)(element);
        return localName === "button" || localName === "input" && element.getAttribute("type") !== "hidden" || localName === "meter" || localName === "output" || localName === "progress" || localName === "select" || localName === "textarea";
      }
      function findLabelableElement(element) {
        if (isLabelableElement(element)) {
          return element;
        }
        var labelableElement = null;
        element.childNodes.forEach(function(childNode) {
          if (labelableElement === null && (0, _util.isElement)(childNode)) {
            var descendantLabelableElement = findLabelableElement(childNode);
            if (descendantLabelableElement !== null) {
              labelableElement = descendantLabelableElement;
            }
          }
        });
        return labelableElement;
      }
      function getControlOfLabel(label) {
        if (label.control !== void 0) {
          return label.control;
        }
        var htmlFor = label.getAttribute("for");
        if (htmlFor !== null) {
          return label.ownerDocument.getElementById(htmlFor);
        }
        return findLabelableElement(label);
      }
      function getLabels(element) {
        var labelsProperty = element.labels;
        if (labelsProperty === null) {
          return labelsProperty;
        }
        if (labelsProperty !== void 0) {
          return (0, _array.default)(labelsProperty);
        }
        if (!isLabelableElement(element)) {
          return null;
        }
        var document2 = element.ownerDocument;
        return (0, _array.default)(document2.querySelectorAll("label")).filter(function(label) {
          return getControlOfLabel(label) === element;
        });
      }
      function getSlotContents(slot) {
        var assignedNodes = slot.assignedNodes();
        if (assignedNodes.length === 0) {
          return (0, _array.default)(slot.childNodes);
        }
        return assignedNodes;
      }
      function computeTextAlternative(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var consultedNodes = new _SetLike.default();
        var window2 = (0, _util.safeWindow)(root);
        var _options$compute = options.compute, compute = _options$compute === void 0 ? "name" : _options$compute, _options$computedStyl = options.computedStyleSupportsPseudoElements, computedStyleSupportsPseudoElements = _options$computedStyl === void 0 ? options.getComputedStyle !== void 0 : _options$computedStyl, _options$getComputedS = options.getComputedStyle, getComputedStyle = _options$getComputedS === void 0 ? window2.getComputedStyle.bind(window2) : _options$getComputedS, _options$hidden = options.hidden, hidden = _options$hidden === void 0 ? false : _options$hidden;
        function computeMiscTextAlternative(node, context) {
          var accumulatedText = "";
          if ((0, _util.isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoBefore = getComputedStyle(node, "::before");
            var beforeContent = getTextualContent(pseudoBefore);
            accumulatedText = "".concat(beforeContent, " ").concat(accumulatedText);
          }
          var childNodes = (0, _util.isHTMLSlotElement)(node) ? getSlotContents(node) : (0, _array.default)(node.childNodes).concat((0, _util.queryIdRefs)(node, "aria-owns"));
          childNodes.forEach(function(child) {
            var result = computeTextAlternative2(child, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false,
              recursion: true
            });
            var display = (0, _util.isElement)(child) ? getComputedStyle(child).getPropertyValue("display") : "inline";
            var separator = display !== "inline" ? " " : "";
            accumulatedText += "".concat(separator).concat(result).concat(separator);
          });
          if ((0, _util.isElement)(node) && computedStyleSupportsPseudoElements) {
            var pseudoAfter = getComputedStyle(node, "::after");
            var afterContent = getTextualContent(pseudoAfter);
            accumulatedText = "".concat(accumulatedText, " ").concat(afterContent);
          }
          return accumulatedText.trim();
        }
        function useAttribute(element, attributeName) {
          var attribute = element.getAttributeNode(attributeName);
          if (attribute !== null && !consultedNodes.has(attribute) && attribute.value.trim() !== "") {
            consultedNodes.add(attribute);
            return attribute.value;
          }
          return null;
        }
        function computeTooltipAttributeValue(node) {
          if (!(0, _util.isElement)(node)) {
            return null;
          }
          return useAttribute(node, "title");
        }
        function computeElementTextAlternative(node) {
          if (!(0, _util.isElement)(node)) {
            return null;
          }
          if ((0, _util.isHTMLFieldSetElement)(node)) {
            consultedNodes.add(node);
            var children = (0, _array.default)(node.childNodes);
            for (var i = 0; i < children.length; i += 1) {
              var child = children[i];
              if ((0, _util.isHTMLLegendElement)(child)) {
                return computeTextAlternative2(child, {
                  isEmbeddedInLabel: false,
                  isReferenced: false,
                  recursion: false
                });
              }
            }
          } else if ((0, _util.isHTMLTableElement)(node)) {
            consultedNodes.add(node);
            var _children = (0, _array.default)(node.childNodes);
            for (var _i = 0; _i < _children.length; _i += 1) {
              var _child = _children[_i];
              if ((0, _util.isHTMLTableCaptionElement)(_child)) {
                return computeTextAlternative2(_child, {
                  isEmbeddedInLabel: false,
                  isReferenced: false,
                  recursion: false
                });
              }
            }
          } else if ((0, _util.isSVGSVGElement)(node)) {
            consultedNodes.add(node);
            var _children2 = (0, _array.default)(node.childNodes);
            for (var _i2 = 0; _i2 < _children2.length; _i2 += 1) {
              var _child2 = _children2[_i2];
              if ((0, _util.isSVGTitleElement)(_child2)) {
                return _child2.textContent;
              }
            }
            return null;
          } else if ((0, _util.getLocalName)(node) === "img" || (0, _util.getLocalName)(node) === "area") {
            var nameFromAlt = useAttribute(node, "alt");
            if (nameFromAlt !== null) {
              return nameFromAlt;
            }
          } else if ((0, _util.isHTMLOptGroupElement)(node)) {
            var nameFromLabel = useAttribute(node, "label");
            if (nameFromLabel !== null) {
              return nameFromLabel;
            }
          }
          if ((0, _util.isHTMLInputElement)(node) && (node.type === "button" || node.type === "submit" || node.type === "reset")) {
            var nameFromValue = useAttribute(node, "value");
            if (nameFromValue !== null) {
              return nameFromValue;
            }
            if (node.type === "submit") {
              return "Submit";
            }
            if (node.type === "reset") {
              return "Reset";
            }
          }
          var labels = getLabels(node);
          if (labels !== null && labels.length !== 0) {
            consultedNodes.add(node);
            return (0, _array.default)(labels).map(function(element) {
              return computeTextAlternative2(element, {
                isEmbeddedInLabel: true,
                isReferenced: false,
                recursion: true
              });
            }).filter(function(label) {
              return label.length > 0;
            }).join(" ");
          }
          if ((0, _util.isHTMLInputElement)(node) && node.type === "image") {
            var _nameFromAlt = useAttribute(node, "alt");
            if (_nameFromAlt !== null) {
              return _nameFromAlt;
            }
            var nameFromTitle = useAttribute(node, "title");
            if (nameFromTitle !== null) {
              return nameFromTitle;
            }
            return "Submit Query";
          }
          if ((0, _util.hasAnyConcreteRoles)(node, ["button"])) {
            var nameFromSubTree = computeMiscTextAlternative(node, {
              isEmbeddedInLabel: false,
              isReferenced: false
            });
            if (nameFromSubTree !== "") {
              return nameFromSubTree;
            }
          }
          return null;
        }
        function computeTextAlternative2(current, context) {
          if (consultedNodes.has(current)) {
            return "";
          }
          if (!hidden && isHidden(current, getComputedStyle) && !context.isReferenced) {
            consultedNodes.add(current);
            return "";
          }
          var labelAttributeNode = (0, _util.isElement)(current) ? current.getAttributeNode("aria-labelledby") : null;
          var labelElements = labelAttributeNode !== null && !consultedNodes.has(labelAttributeNode) ? (0, _util.queryIdRefs)(current, "aria-labelledby") : [];
          if (compute === "name" && !context.isReferenced && labelElements.length > 0) {
            consultedNodes.add(labelAttributeNode);
            return labelElements.map(function(element) {
              return computeTextAlternative2(element, {
                isEmbeddedInLabel: context.isEmbeddedInLabel,
                isReferenced: true,
                // this isn't recursion as specified, otherwise we would skip
                // `aria-label` in
                // <input id="myself" aria-label="foo" aria-labelledby="myself"
                recursion: false
              });
            }).join(" ");
          }
          var skipToStep2E = context.recursion && isControl(current) && compute === "name";
          if (!skipToStep2E) {
            var ariaLabel = ((0, _util.isElement)(current) && current.getAttribute("aria-label") || "").trim();
            if (ariaLabel !== "" && compute === "name") {
              consultedNodes.add(current);
              return ariaLabel;
            }
            if (!isMarkedPresentational(current)) {
              var elementTextAlternative = computeElementTextAlternative(current);
              if (elementTextAlternative !== null) {
                consultedNodes.add(current);
                return elementTextAlternative;
              }
            }
          }
          if ((0, _util.hasAnyConcreteRoles)(current, ["menu"])) {
            consultedNodes.add(current);
            return "";
          }
          if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
            if ((0, _util.hasAnyConcreteRoles)(current, ["combobox", "listbox"])) {
              consultedNodes.add(current);
              var selectedOptions = querySelectedOptions(current);
              if (selectedOptions.length === 0) {
                return (0, _util.isHTMLInputElement)(current) ? current.value : "";
              }
              return (0, _array.default)(selectedOptions).map(function(selectedOption) {
                return computeTextAlternative2(selectedOption, {
                  isEmbeddedInLabel: context.isEmbeddedInLabel,
                  isReferenced: false,
                  recursion: true
                });
              }).join(" ");
            }
            if (hasAbstractRole(current, "range")) {
              consultedNodes.add(current);
              if (current.hasAttribute("aria-valuetext")) {
                return current.getAttribute("aria-valuetext");
              }
              if (current.hasAttribute("aria-valuenow")) {
                return current.getAttribute("aria-valuenow");
              }
              return current.getAttribute("value") || "";
            }
            if ((0, _util.hasAnyConcreteRoles)(current, ["textbox"])) {
              consultedNodes.add(current);
              return getValueOfTextbox(current);
            }
          }
          if (allowsNameFromContent(current) || (0, _util.isElement)(current) && context.isReferenced || isNativeHostLanguageTextAlternativeElement(current) || isDescendantOfNativeHostLanguageTextAlternativeElement(current)) {
            var accumulatedText2F = computeMiscTextAlternative(current, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false
            });
            if (accumulatedText2F !== "") {
              consultedNodes.add(current);
              return accumulatedText2F;
            }
          }
          if (current.nodeType === current.TEXT_NODE) {
            consultedNodes.add(current);
            return current.textContent || "";
          }
          if (context.recursion) {
            consultedNodes.add(current);
            return computeMiscTextAlternative(current, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false
            });
          }
          var tooltipAttributeValue = computeTooltipAttributeValue(current);
          if (tooltipAttributeValue !== null) {
            consultedNodes.add(current);
            return tooltipAttributeValue;
          }
          consultedNodes.add(current);
          return "";
        }
        return asFlatString(computeTextAlternative2(root, {
          isEmbeddedInLabel: false,
          // by spec computeAccessibleDescription starts with the referenced elements as roots
          isReferenced: compute === "description",
          recursion: false
        }));
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-description.js
  var require_accessible_description = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-description.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeAccessibleDescription = computeAccessibleDescription;
      var _accessibleNameAndDescription = require_accessible_name_and_description();
      var _util = require_util();
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function computeAccessibleDescription(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var description = (0, _util.queryIdRefs)(root, "aria-describedby").map(function(element) {
          return (0, _accessibleNameAndDescription.computeTextAlternative)(element, _objectSpread(_objectSpread({}, options), {}, {
            compute: "description"
          }));
        }).join(" ");
        if (description === "") {
          var title = root.getAttribute("title");
          description = title === null ? "" : title;
        }
        return description;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/accessible-name.js
  var require_accessible_name = __commonJS({
    "node_modules/dom-accessibility-api/dist/accessible-name.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.computeAccessibleName = computeAccessibleName;
      var _accessibleNameAndDescription = require_accessible_name_and_description();
      var _util = require_util();
      function prohibitsNaming(node) {
        return (0, _util.hasAnyConcreteRoles)(node, ["caption", "code", "deletion", "emphasis", "generic", "insertion", "paragraph", "presentation", "strong", "subscript", "superscript"]);
      }
      function computeAccessibleName(root) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (prohibitsNaming(root)) {
          return "";
        }
        return (0, _accessibleNameAndDescription.computeTextAlternative)(root, options);
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/is-inaccessible.js
  var require_is_inaccessible = __commonJS({
    "node_modules/dom-accessibility-api/dist/is-inaccessible.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.isInaccessible = isInaccessible;
      exports.isSubtreeInaccessible = isSubtreeInaccessible;
      function isInaccessible(element) {
        var _element$ownerDocumen;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _options$getComputedS = options.getComputedStyle, getComputedStyle = _options$getComputedS === void 0 ? (_element$ownerDocumen = element.ownerDocument.defaultView) === null || _element$ownerDocumen === void 0 ? void 0 : _element$ownerDocumen.getComputedStyle : _options$getComputedS, _options$isSubtreeIna = options.isSubtreeInaccessible, isSubtreeInaccessibleImpl = _options$isSubtreeIna === void 0 ? isSubtreeInaccessible : _options$isSubtreeIna;
        if (typeof getComputedStyle !== "function") {
          throw new TypeError("Owner document of the element needs to have an associated window.");
        }
        if (getComputedStyle(element).visibility === "hidden") {
          return true;
        }
        var currentElement = element;
        while (currentElement) {
          if (isSubtreeInaccessibleImpl(currentElement, {
            getComputedStyle
          })) {
            return true;
          }
          currentElement = currentElement.parentElement;
        }
        return false;
      }
      function isSubtreeInaccessible(element) {
        var _element$ownerDocumen2;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _options$getComputedS2 = options.getComputedStyle, getComputedStyle = _options$getComputedS2 === void 0 ? (_element$ownerDocumen2 = element.ownerDocument.defaultView) === null || _element$ownerDocumen2 === void 0 ? void 0 : _element$ownerDocumen2.getComputedStyle : _options$getComputedS2;
        if (typeof getComputedStyle !== "function") {
          throw new TypeError("Owner document of the element needs to have an associated window.");
        }
        if (element.hidden === true) {
          return true;
        }
        if (element.getAttribute("aria-hidden") === "true") {
          return true;
        }
        if (getComputedStyle(element).display === "none") {
          return true;
        }
        return false;
      }
    }
  });

  // node_modules/dom-accessibility-api/dist/index.js
  var require_dist = __commonJS({
    "node_modules/dom-accessibility-api/dist/index.js"(exports) {
      "use strict";
      exports.__esModule = true;
      var _exportNames = {
        computeAccessibleDescription: true,
        computeAccessibleName: true,
        getRole: true
      };
      exports.getRole = exports.computeAccessibleName = exports.computeAccessibleDescription = void 0;
      var _accessibleDescription = require_accessible_description();
      exports.computeAccessibleDescription = _accessibleDescription.computeAccessibleDescription;
      var _accessibleName = require_accessible_name();
      exports.computeAccessibleName = _accessibleName.computeAccessibleName;
      var _getRole = _interopRequireDefault(require_getRole());
      exports.getRole = _getRole.default;
      var _isInaccessible = require_is_inaccessible();
      Object.keys(_isInaccessible).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _isInaccessible[key]) return;
        exports[key] = _isInaccessible[key];
      });
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
    }
  });

  // node_modules/aria-query/lib/util/iteratorProxy.js
  var require_iteratorProxy = __commonJS({
    "node_modules/aria-query/lib/util/iteratorProxy.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      function iteratorProxy() {
        var values = this;
        var index = 0;
        var iter = {
          "@@iterator": function iterator() {
            return iter;
          },
          next: function next() {
            if (index < values.length) {
              var value = values[index];
              index = index + 1;
              return {
                done: false,
                value
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return iter;
      }
      var _default = iteratorProxy;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/util/iterationDecorator.js
  var require_iterationDecorator = __commonJS({
    "node_modules/aria-query/lib/util/iterationDecorator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = iterationDecorator;
      var _iteratorProxy = _interopRequireDefault(require_iteratorProxy());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function iterationDecorator(collection, entries) {
        if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
          Object.defineProperty(collection, Symbol.iterator, {
            value: _iteratorProxy.default.bind(entries)
          });
        }
        return collection;
      }
    }
  });

  // node_modules/aria-query/lib/ariaPropsMap.js
  var require_ariaPropsMap = __commonJS({
    "node_modules/aria-query/lib/ariaPropsMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _iterationDecorator = _interopRequireDefault(require_iterationDecorator());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F2() {
            };
            return { s: F, n: function n() {
              if (i >= o.length) return { done: true };
              return { done: false, value: o[i++] };
            }, e: function e(_e2) {
              throw _e2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true, didErr = false, err;
        return { s: function s() {
          it = it.call(o);
        }, n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        }, e: function e(_e3) {
          didErr = true;
          err = _e3;
        }, f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        } };
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      var properties = [["aria-activedescendant", {
        "type": "id"
      }], ["aria-atomic", {
        "type": "boolean"
      }], ["aria-autocomplete", {
        "type": "token",
        "values": ["inline", "list", "both", "none"]
      }], ["aria-braillelabel", {
        "type": "string"
      }], ["aria-brailleroledescription", {
        "type": "string"
      }], ["aria-busy", {
        "type": "boolean"
      }], ["aria-checked", {
        "type": "tristate"
      }], ["aria-colcount", {
        type: "integer"
      }], ["aria-colindex", {
        type: "integer"
      }], ["aria-colspan", {
        type: "integer"
      }], ["aria-controls", {
        "type": "idlist"
      }], ["aria-current", {
        type: "token",
        values: ["page", "step", "location", "date", "time", true, false]
      }], ["aria-describedby", {
        "type": "idlist"
      }], ["aria-description", {
        "type": "string"
      }], ["aria-details", {
        "type": "id"
      }], ["aria-disabled", {
        "type": "boolean"
      }], ["aria-dropeffect", {
        "type": "tokenlist",
        "values": ["copy", "execute", "link", "move", "none", "popup"]
      }], ["aria-errormessage", {
        "type": "id"
      }], ["aria-expanded", {
        "type": "boolean",
        "allowundefined": true
      }], ["aria-flowto", {
        "type": "idlist"
      }], ["aria-grabbed", {
        "type": "boolean",
        "allowundefined": true
      }], ["aria-haspopup", {
        "type": "token",
        "values": [false, true, "menu", "listbox", "tree", "grid", "dialog"]
      }], ["aria-hidden", {
        "type": "boolean",
        "allowundefined": true
      }], ["aria-invalid", {
        "type": "token",
        "values": ["grammar", false, "spelling", true]
      }], ["aria-keyshortcuts", {
        type: "string"
      }], ["aria-label", {
        "type": "string"
      }], ["aria-labelledby", {
        "type": "idlist"
      }], ["aria-level", {
        "type": "integer"
      }], ["aria-live", {
        "type": "token",
        "values": ["assertive", "off", "polite"]
      }], ["aria-modal", {
        type: "boolean"
      }], ["aria-multiline", {
        "type": "boolean"
      }], ["aria-multiselectable", {
        "type": "boolean"
      }], ["aria-orientation", {
        "type": "token",
        "values": ["vertical", "undefined", "horizontal"]
      }], ["aria-owns", {
        "type": "idlist"
      }], ["aria-placeholder", {
        type: "string"
      }], ["aria-posinset", {
        "type": "integer"
      }], ["aria-pressed", {
        "type": "tristate"
      }], ["aria-readonly", {
        "type": "boolean"
      }], ["aria-relevant", {
        "type": "tokenlist",
        "values": ["additions", "all", "removals", "text"]
      }], ["aria-required", {
        "type": "boolean"
      }], ["aria-roledescription", {
        type: "string"
      }], ["aria-rowcount", {
        type: "integer"
      }], ["aria-rowindex", {
        type: "integer"
      }], ["aria-rowspan", {
        type: "integer"
      }], ["aria-selected", {
        "type": "boolean",
        "allowundefined": true
      }], ["aria-setsize", {
        "type": "integer"
      }], ["aria-sort", {
        "type": "token",
        "values": ["ascending", "descending", "none", "other"]
      }], ["aria-valuemax", {
        "type": "number"
      }], ["aria-valuemin", {
        "type": "number"
      }], ["aria-valuenow", {
        "type": "number"
      }], ["aria-valuetext", {
        "type": "string"
      }]];
      var ariaPropsMap = {
        entries: function entries() {
          return properties;
        },
        forEach: function forEach(fn) {
          var thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          var _iterator = _createForOfIteratorHelper(properties), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], values = _step$value[1];
              fn.call(thisArg, values, key, properties);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        },
        get: function get(key) {
          var item = properties.find(function(tuple) {
            return tuple[0] === key ? true : false;
          });
          return item && item[1];
        },
        has: function has(key) {
          return !!ariaPropsMap.get(key);
        },
        keys: function keys() {
          return properties.map(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
            return key;
          });
        },
        values: function values() {
          return properties.map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
            return values2;
          });
        }
      };
      var _default = (0, _iterationDecorator.default)(ariaPropsMap, ariaPropsMap.entries());
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/domMap.js
  var require_domMap = __commonJS({
    "node_modules/aria-query/lib/domMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _iterationDecorator = _interopRequireDefault(require_iterationDecorator());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F2() {
            };
            return { s: F, n: function n() {
              if (i >= o.length) return { done: true };
              return { done: false, value: o[i++] };
            }, e: function e(_e2) {
              throw _e2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true, didErr = false, err;
        return { s: function s() {
          it = it.call(o);
        }, n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        }, e: function e(_e3) {
          didErr = true;
          err = _e3;
        }, f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        } };
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      var dom = [["a", {
        reserved: false
      }], ["abbr", {
        reserved: false
      }], ["acronym", {
        reserved: false
      }], ["address", {
        reserved: false
      }], ["applet", {
        reserved: false
      }], ["area", {
        reserved: false
      }], ["article", {
        reserved: false
      }], ["aside", {
        reserved: false
      }], ["audio", {
        reserved: false
      }], ["b", {
        reserved: false
      }], ["base", {
        reserved: true
      }], ["bdi", {
        reserved: false
      }], ["bdo", {
        reserved: false
      }], ["big", {
        reserved: false
      }], ["blink", {
        reserved: false
      }], ["blockquote", {
        reserved: false
      }], ["body", {
        reserved: false
      }], ["br", {
        reserved: false
      }], ["button", {
        reserved: false
      }], ["canvas", {
        reserved: false
      }], ["caption", {
        reserved: false
      }], ["center", {
        reserved: false
      }], ["cite", {
        reserved: false
      }], ["code", {
        reserved: false
      }], ["col", {
        reserved: true
      }], ["colgroup", {
        reserved: true
      }], ["content", {
        reserved: false
      }], ["data", {
        reserved: false
      }], ["datalist", {
        reserved: false
      }], ["dd", {
        reserved: false
      }], ["del", {
        reserved: false
      }], ["details", {
        reserved: false
      }], ["dfn", {
        reserved: false
      }], ["dialog", {
        reserved: false
      }], ["dir", {
        reserved: false
      }], ["div", {
        reserved: false
      }], ["dl", {
        reserved: false
      }], ["dt", {
        reserved: false
      }], ["em", {
        reserved: false
      }], ["embed", {
        reserved: false
      }], ["fieldset", {
        reserved: false
      }], ["figcaption", {
        reserved: false
      }], ["figure", {
        reserved: false
      }], ["font", {
        reserved: false
      }], ["footer", {
        reserved: false
      }], ["form", {
        reserved: false
      }], ["frame", {
        reserved: false
      }], ["frameset", {
        reserved: false
      }], ["h1", {
        reserved: false
      }], ["h2", {
        reserved: false
      }], ["h3", {
        reserved: false
      }], ["h4", {
        reserved: false
      }], ["h5", {
        reserved: false
      }], ["h6", {
        reserved: false
      }], ["head", {
        reserved: true
      }], ["header", {
        reserved: false
      }], ["hgroup", {
        reserved: false
      }], ["hr", {
        reserved: false
      }], ["html", {
        reserved: true
      }], ["i", {
        reserved: false
      }], ["iframe", {
        reserved: false
      }], ["img", {
        reserved: false
      }], ["input", {
        reserved: false
      }], ["ins", {
        reserved: false
      }], ["kbd", {
        reserved: false
      }], ["keygen", {
        reserved: false
      }], ["label", {
        reserved: false
      }], ["legend", {
        reserved: false
      }], ["li", {
        reserved: false
      }], ["link", {
        reserved: true
      }], ["main", {
        reserved: false
      }], ["map", {
        reserved: false
      }], ["mark", {
        reserved: false
      }], ["marquee", {
        reserved: false
      }], ["menu", {
        reserved: false
      }], ["menuitem", {
        reserved: false
      }], ["meta", {
        reserved: true
      }], ["meter", {
        reserved: false
      }], ["nav", {
        reserved: false
      }], ["noembed", {
        reserved: true
      }], ["noscript", {
        reserved: true
      }], ["object", {
        reserved: false
      }], ["ol", {
        reserved: false
      }], ["optgroup", {
        reserved: false
      }], ["option", {
        reserved: false
      }], ["output", {
        reserved: false
      }], ["p", {
        reserved: false
      }], ["param", {
        reserved: true
      }], ["picture", {
        reserved: true
      }], ["pre", {
        reserved: false
      }], ["progress", {
        reserved: false
      }], ["q", {
        reserved: false
      }], ["rp", {
        reserved: false
      }], ["rt", {
        reserved: false
      }], ["rtc", {
        reserved: false
      }], ["ruby", {
        reserved: false
      }], ["s", {
        reserved: false
      }], ["samp", {
        reserved: false
      }], ["script", {
        reserved: true
      }], ["section", {
        reserved: false
      }], ["select", {
        reserved: false
      }], ["small", {
        reserved: false
      }], ["source", {
        reserved: true
      }], ["spacer", {
        reserved: false
      }], ["span", {
        reserved: false
      }], ["strike", {
        reserved: false
      }], ["strong", {
        reserved: false
      }], ["style", {
        reserved: true
      }], ["sub", {
        reserved: false
      }], ["summary", {
        reserved: false
      }], ["sup", {
        reserved: false
      }], ["table", {
        reserved: false
      }], ["tbody", {
        reserved: false
      }], ["td", {
        reserved: false
      }], ["textarea", {
        reserved: false
      }], ["tfoot", {
        reserved: false
      }], ["th", {
        reserved: false
      }], ["thead", {
        reserved: false
      }], ["time", {
        reserved: false
      }], ["title", {
        reserved: true
      }], ["tr", {
        reserved: false
      }], ["track", {
        reserved: true
      }], ["tt", {
        reserved: false
      }], ["u", {
        reserved: false
      }], ["ul", {
        reserved: false
      }], ["var", {
        reserved: false
      }], ["video", {
        reserved: false
      }], ["wbr", {
        reserved: false
      }], ["xmp", {
        reserved: false
      }]];
      var domMap = {
        entries: function entries() {
          return dom;
        },
        forEach: function forEach(fn) {
          var thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          var _iterator = _createForOfIteratorHelper(dom), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], values = _step$value[1];
              fn.call(thisArg, values, key, dom);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        },
        get: function get(key) {
          var item = dom.find(function(tuple) {
            return tuple[0] === key ? true : false;
          });
          return item && item[1];
        },
        has: function has(key) {
          return !!domMap.get(key);
        },
        keys: function keys() {
          return dom.map(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 1), key = _ref2[0];
            return key;
          });
        },
        values: function values() {
          return dom.map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
            return values2;
          });
        }
      };
      var _default = (0, _iterationDecorator.default)(domMap, domMap.entries());
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/commandRole.js
  var require_commandRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/commandRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var commandRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget"]]
      };
      var _default = commandRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/compositeRole.js
  var require_compositeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/compositeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var compositeRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-activedescendant": null,
          "aria-disabled": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget"]]
      };
      var _default = compositeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/inputRole.js
  var require_inputRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/inputRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var inputRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null
        },
        relatedConcepts: [{
          concept: {
            name: "input"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget"]]
      };
      var _default = inputRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/landmarkRole.js
  var require_landmarkRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/landmarkRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var landmarkRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = landmarkRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/rangeRole.js
  var require_rangeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/rangeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var rangeRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-valuemax": null,
          "aria-valuemin": null,
          "aria-valuenow": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = rangeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/roletypeRole.js
  var require_roletypeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/roletypeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var roletypeRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: [],
        prohibitedProps: [],
        props: {
          "aria-atomic": null,
          "aria-busy": null,
          "aria-controls": null,
          "aria-current": null,
          "aria-describedby": null,
          "aria-details": null,
          "aria-dropeffect": null,
          "aria-flowto": null,
          "aria-grabbed": null,
          "aria-hidden": null,
          "aria-keyshortcuts": null,
          "aria-label": null,
          "aria-labelledby": null,
          "aria-live": null,
          "aria-owns": null,
          "aria-relevant": null,
          "aria-roledescription": null
        },
        relatedConcepts: [{
          concept: {
            name: "role"
          },
          module: "XHTML"
        }, {
          concept: {
            name: "type"
          },
          module: "Dublin Core"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: []
      };
      var _default = roletypeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/sectionRole.js
  var require_sectionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/sectionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var sectionRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: [],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "frontmatter"
          },
          module: "DTB"
        }, {
          concept: {
            name: "level"
          },
          module: "DTB"
        }, {
          concept: {
            name: "level"
          },
          module: "SMIL"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = sectionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/sectionheadRole.js
  var require_sectionheadRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/sectionheadRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var sectionheadRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = sectionheadRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/selectRole.js
  var require_selectRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/selectRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var selectRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-orientation": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite"], ["roletype", "structure", "section", "group"]]
      };
      var _default = selectRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/structureRole.js
  var require_structureRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/structureRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var structureRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: [],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype"]]
      };
      var _default = structureRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/widgetRole.js
  var require_widgetRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/widgetRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var widgetRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: [],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype"]]
      };
      var _default = widgetRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/abstract/windowRole.js
  var require_windowRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/abstract/windowRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var windowRole = {
        abstract: true,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-modal": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype"]]
      };
      var _default = windowRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/ariaAbstractRoles.js
  var require_ariaAbstractRoles = __commonJS({
    "node_modules/aria-query/lib/etc/roles/ariaAbstractRoles.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _commandRole = _interopRequireDefault(require_commandRole());
      var _compositeRole = _interopRequireDefault(require_compositeRole());
      var _inputRole = _interopRequireDefault(require_inputRole());
      var _landmarkRole = _interopRequireDefault(require_landmarkRole());
      var _rangeRole = _interopRequireDefault(require_rangeRole());
      var _roletypeRole = _interopRequireDefault(require_roletypeRole());
      var _sectionRole = _interopRequireDefault(require_sectionRole());
      var _sectionheadRole = _interopRequireDefault(require_sectionheadRole());
      var _selectRole = _interopRequireDefault(require_selectRole());
      var _structureRole = _interopRequireDefault(require_structureRole());
      var _widgetRole = _interopRequireDefault(require_widgetRole());
      var _windowRole = _interopRequireDefault(require_windowRole());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var ariaAbstractRoles = [["command", _commandRole.default], ["composite", _compositeRole.default], ["input", _inputRole.default], ["landmark", _landmarkRole.default], ["range", _rangeRole.default], ["roletype", _roletypeRole.default], ["section", _sectionRole.default], ["sectionhead", _sectionheadRole.default], ["select", _selectRole.default], ["structure", _structureRole.default], ["widget", _widgetRole.default], ["window", _windowRole.default]];
      var _default = ariaAbstractRoles;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/alertRole.js
  var require_alertRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/alertRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var alertRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-atomic": "true",
          "aria-live": "assertive"
        },
        relatedConcepts: [{
          concept: {
            name: "alert"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = alertRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/alertdialogRole.js
  var require_alertdialogRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/alertdialogRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var alertdialogRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "alert"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "alert"], ["roletype", "window", "dialog"]]
      };
      var _default = alertdialogRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/applicationRole.js
  var require_applicationRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/applicationRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var applicationRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-activedescendant": null,
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "Device Independence Delivery Unit"
          }
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = applicationRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/articleRole.js
  var require_articleRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/articleRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var articleRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-posinset": null,
          "aria-setsize": null
        },
        relatedConcepts: [{
          concept: {
            name: "article"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "document"]]
      };
      var _default = articleRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/bannerRole.js
  var require_bannerRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/bannerRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var bannerRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            constraints: ["scoped to the body element"],
            name: "header"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = bannerRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/blockquoteRole.js
  var require_blockquoteRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/blockquoteRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var blockquoteRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "blockquote"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = blockquoteRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/buttonRole.js
  var require_buttonRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/buttonRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var buttonRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-pressed": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "type",
              value: "button"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "type",
              value: "image"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "type",
              value: "reset"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "type",
              value: "submit"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            name: "button"
          },
          module: "HTML"
        }, {
          concept: {
            name: "trigger"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command"]]
      };
      var _default = buttonRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/captionRole.js
  var require_captionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/captionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var captionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "caption"
          },
          module: "HTML"
        }],
        requireContextRole: ["figure", "grid", "table"],
        requiredContextRole: ["figure", "grid", "table"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = captionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/cellRole.js
  var require_cellRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/cellRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var cellRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-colindex": null,
          "aria-colspan": null,
          "aria-rowindex": null,
          "aria-rowspan": null
        },
        relatedConcepts: [{
          concept: {
            constraints: ["ancestor table element has table role"],
            name: "td"
          },
          module: "HTML"
        }],
        requireContextRole: ["row"],
        requiredContextRole: ["row"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = cellRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/checkboxRole.js
  var require_checkboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/checkboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var checkboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-checked": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-required": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "type",
              value: "checkbox"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            name: "option"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-checked": null
        },
        superClass: [["roletype", "widget", "input"]]
      };
      var _default = checkboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/codeRole.js
  var require_codeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/codeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var codeRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "code"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = codeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/columnheaderRole.js
  var require_columnheaderRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/columnheaderRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var columnheaderRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-sort": null
        },
        relatedConcepts: [{
          concept: {
            name: "th"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "scope",
              value: "col"
            }],
            name: "th"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "scope",
              value: "colgroup"
            }],
            name: "th"
          },
          module: "HTML"
        }],
        requireContextRole: ["row"],
        requiredContextRole: ["row"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "cell"], ["roletype", "structure", "section", "cell", "gridcell"], ["roletype", "widget", "gridcell"], ["roletype", "structure", "sectionhead"]]
      };
      var _default = columnheaderRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/comboboxRole.js
  var require_comboboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/comboboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var comboboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-activedescendant": null,
          "aria-autocomplete": null,
          "aria-errormessage": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-required": null,
          "aria-expanded": "false",
          "aria-haspopup": "listbox"
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "email"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "search"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "tel"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "text"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "url"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "list"
            }, {
              name: "type",
              value: "url"
            }],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "multiple"
            }, {
              constraints: ["undefined"],
              name: "size"
            }],
            constraints: ["the multiple attribute is not set and the size attribute does not have a value greater than 1"],
            name: "select"
          },
          module: "HTML"
        }, {
          concept: {
            name: "select"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-controls": null,
          "aria-expanded": "false"
        },
        superClass: [["roletype", "widget", "input"]]
      };
      var _default = comboboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/complementaryRole.js
  var require_complementaryRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/complementaryRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var complementaryRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "aside"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-label"
            }],
            constraints: ["scoped to a sectioning content element", "scoped to a sectioning root element other than body"],
            name: "aside"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-labelledby"
            }],
            constraints: ["scoped to a sectioning content element", "scoped to a sectioning root element other than body"],
            name: "aside"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = complementaryRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/contentinfoRole.js
  var require_contentinfoRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/contentinfoRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var contentinfoRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            constraints: ["scoped to the body element"],
            name: "footer"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = contentinfoRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/definitionRole.js
  var require_definitionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/definitionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var definitionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "dd"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = definitionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/deletionRole.js
  var require_deletionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/deletionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var deletionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "del"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = deletionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/dialogRole.js
  var require_dialogRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/dialogRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var dialogRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "dialog"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "window"]]
      };
      var _default = dialogRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/directoryRole.js
  var require_directoryRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/directoryRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var directoryRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          module: "DAISY Guide"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "list"]]
      };
      var _default = directoryRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/documentRole.js
  var require_documentRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/documentRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var documentRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "Device Independence Delivery Unit"
          }
        }, {
          concept: {
            name: "html"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = documentRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/emphasisRole.js
  var require_emphasisRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/emphasisRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var emphasisRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "em"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = emphasisRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/feedRole.js
  var require_feedRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/feedRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var feedRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["article"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "list"]]
      };
      var _default = feedRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/figureRole.js
  var require_figureRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/figureRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var figureRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "figure"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = figureRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/formRole.js
  var require_formRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/formRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var formRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-label"
            }],
            name: "form"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-labelledby"
            }],
            name: "form"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "name"
            }],
            name: "form"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = formRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/genericRole.js
  var require_genericRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/genericRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var genericRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "a"
          },
          module: "HTML"
        }, {
          concept: {
            name: "area"
          },
          module: "HTML"
        }, {
          concept: {
            name: "aside"
          },
          module: "HTML"
        }, {
          concept: {
            name: "b"
          },
          module: "HTML"
        }, {
          concept: {
            name: "bdo"
          },
          module: "HTML"
        }, {
          concept: {
            name: "body"
          },
          module: "HTML"
        }, {
          concept: {
            name: "data"
          },
          module: "HTML"
        }, {
          concept: {
            name: "div"
          },
          module: "HTML"
        }, {
          concept: {
            constraints: ["scoped to the main element", "scoped to a sectioning content element", "scoped to a sectioning root element other than body"],
            name: "footer"
          },
          module: "HTML"
        }, {
          concept: {
            constraints: ["scoped to the main element", "scoped to a sectioning content element", "scoped to a sectioning root element other than body"],
            name: "header"
          },
          module: "HTML"
        }, {
          concept: {
            name: "hgroup"
          },
          module: "HTML"
        }, {
          concept: {
            name: "i"
          },
          module: "HTML"
        }, {
          concept: {
            name: "pre"
          },
          module: "HTML"
        }, {
          concept: {
            name: "q"
          },
          module: "HTML"
        }, {
          concept: {
            name: "samp"
          },
          module: "HTML"
        }, {
          concept: {
            name: "section"
          },
          module: "HTML"
        }, {
          concept: {
            name: "small"
          },
          module: "HTML"
        }, {
          concept: {
            name: "span"
          },
          module: "HTML"
        }, {
          concept: {
            name: "u"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = genericRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/gridRole.js
  var require_gridRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/gridRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var gridRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-multiselectable": null,
          "aria-readonly": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["row"], ["row", "rowgroup"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite"], ["roletype", "structure", "section", "table"]]
      };
      var _default = gridRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/gridcellRole.js
  var require_gridcellRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/gridcellRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var gridcellRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-required": null,
          "aria-selected": null
        },
        relatedConcepts: [{
          concept: {
            constraints: ["ancestor table element has grid role", "ancestor table element has treegrid role"],
            name: "td"
          },
          module: "HTML"
        }],
        requireContextRole: ["row"],
        requiredContextRole: ["row"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "cell"], ["roletype", "widget"]]
      };
      var _default = gridcellRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/groupRole.js
  var require_groupRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/groupRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var groupRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-activedescendant": null,
          "aria-disabled": null
        },
        relatedConcepts: [{
          concept: {
            name: "details"
          },
          module: "HTML"
        }, {
          concept: {
            name: "fieldset"
          },
          module: "HTML"
        }, {
          concept: {
            name: "optgroup"
          },
          module: "HTML"
        }, {
          concept: {
            name: "address"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = groupRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/headingRole.js
  var require_headingRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/headingRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var headingRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-level": "2"
        },
        relatedConcepts: [{
          concept: {
            name: "h1"
          },
          module: "HTML"
        }, {
          concept: {
            name: "h2"
          },
          module: "HTML"
        }, {
          concept: {
            name: "h3"
          },
          module: "HTML"
        }, {
          concept: {
            name: "h4"
          },
          module: "HTML"
        }, {
          concept: {
            name: "h5"
          },
          module: "HTML"
        }, {
          concept: {
            name: "h6"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-level": "2"
        },
        superClass: [["roletype", "structure", "sectionhead"]]
      };
      var _default = headingRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/imgRole.js
  var require_imgRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/imgRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var imgRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "alt"
            }],
            name: "img"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "alt"
            }],
            name: "img"
          },
          module: "HTML"
        }, {
          concept: {
            name: "imggroup"
          },
          module: "DTB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = imgRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/insertionRole.js
  var require_insertionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/insertionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var insertionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "ins"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = insertionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/linkRole.js
  var require_linkRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/linkRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var linkRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-expanded": null,
          "aria-haspopup": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "href"
            }],
            name: "a"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "href"
            }],
            name: "area"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command"]]
      };
      var _default = linkRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/listRole.js
  var require_listRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/listRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var listRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "menu"
          },
          module: "HTML"
        }, {
          concept: {
            name: "ol"
          },
          module: "HTML"
        }, {
          concept: {
            name: "ul"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["listitem"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = listRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/listboxRole.js
  var require_listboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/listboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var listboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-invalid": null,
          "aria-multiselectable": null,
          "aria-readonly": null,
          "aria-required": null,
          "aria-orientation": "vertical"
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: [">1"],
              name: "size"
            }],
            constraints: ["the size attribute value is greater than 1"],
            name: "select"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "multiple"
            }],
            name: "select"
          },
          module: "HTML"
        }, {
          concept: {
            name: "datalist"
          },
          module: "HTML"
        }, {
          concept: {
            name: "list"
          },
          module: "ARIA"
        }, {
          concept: {
            name: "select"
          },
          module: "XForms"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["option", "group"], ["option"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
      };
      var _default = listboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/listitemRole.js
  var require_listitemRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/listitemRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var listitemRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-level": null,
          "aria-posinset": null,
          "aria-setsize": null
        },
        relatedConcepts: [{
          concept: {
            constraints: ["direct descendant of ol", "direct descendant of ul", "direct descendant of menu"],
            name: "li"
          },
          module: "HTML"
        }, {
          concept: {
            name: "item"
          },
          module: "XForms"
        }],
        requireContextRole: ["directory", "list"],
        requiredContextRole: ["directory", "list"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = listitemRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/logRole.js
  var require_logRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/logRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var logRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-live": "polite"
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = logRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/mainRole.js
  var require_mainRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/mainRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var mainRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "main"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = mainRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/markRole.js
  var require_markRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/markRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var markRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: [],
        props: {
          "aria-braillelabel": null,
          "aria-brailleroledescription": null,
          "aria-description": null
        },
        relatedConcepts: [{
          concept: {
            name: "mark"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = markRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/marqueeRole.js
  var require_marqueeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/marqueeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var marqueeRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = marqueeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/mathRole.js
  var require_mathRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/mathRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var mathRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "math"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = mathRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/menuRole.js
  var require_menuRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/menuRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var menuRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-orientation": "vertical"
        },
        relatedConcepts: [{
          concept: {
            name: "MENU"
          },
          module: "JAPI"
        }, {
          concept: {
            name: "list"
          },
          module: "ARIA"
        }, {
          concept: {
            name: "select"
          },
          module: "XForms"
        }, {
          concept: {
            name: "sidebar"
          },
          module: "DTB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["menuitem", "group"], ["menuitemradio", "group"], ["menuitemcheckbox", "group"], ["menuitem"], ["menuitemcheckbox"], ["menuitemradio"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
      };
      var _default = menuRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/menubarRole.js
  var require_menubarRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/menubarRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var menubarRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-orientation": "horizontal"
        },
        relatedConcepts: [{
          concept: {
            name: "toolbar"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["menuitem", "group"], ["menuitemradio", "group"], ["menuitemcheckbox", "group"], ["menuitem"], ["menuitemcheckbox"], ["menuitemradio"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "select", "menu"], ["roletype", "structure", "section", "group", "select", "menu"]]
      };
      var _default = menubarRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/menuitemRole.js
  var require_menuitemRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/menuitemRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var menuitemRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-posinset": null,
          "aria-setsize": null
        },
        relatedConcepts: [{
          concept: {
            name: "MENU_ITEM"
          },
          module: "JAPI"
        }, {
          concept: {
            name: "listitem"
          },
          module: "ARIA"
        }, {
          concept: {
            name: "option"
          },
          module: "ARIA"
        }],
        requireContextRole: ["group", "menu", "menubar"],
        requiredContextRole: ["group", "menu", "menubar"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command"]]
      };
      var _default = menuitemRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/menuitemcheckboxRole.js
  var require_menuitemcheckboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/menuitemcheckboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var menuitemcheckboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "menuitem"
          },
          module: "ARIA"
        }],
        requireContextRole: ["group", "menu", "menubar"],
        requiredContextRole: ["group", "menu", "menubar"],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-checked": null
        },
        superClass: [["roletype", "widget", "input", "checkbox"], ["roletype", "widget", "command", "menuitem"]]
      };
      var _default = menuitemcheckboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/menuitemradioRole.js
  var require_menuitemradioRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/menuitemradioRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var menuitemradioRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "menuitem"
          },
          module: "ARIA"
        }],
        requireContextRole: ["group", "menu", "menubar"],
        requiredContextRole: ["group", "menu", "menubar"],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-checked": null
        },
        superClass: [["roletype", "widget", "input", "checkbox", "menuitemcheckbox"], ["roletype", "widget", "command", "menuitem", "menuitemcheckbox"], ["roletype", "widget", "input", "radio"]]
      };
      var _default = menuitemradioRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/meterRole.js
  var require_meterRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/meterRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var meterRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-valuetext": null,
          "aria-valuemax": "100",
          "aria-valuemin": "0"
        },
        relatedConcepts: [{
          concept: {
            name: "meter"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-valuenow": null
        },
        superClass: [["roletype", "structure", "range"]]
      };
      var _default = meterRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/navigationRole.js
  var require_navigationRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/navigationRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var navigationRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "nav"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = navigationRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/noneRole.js
  var require_noneRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/noneRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var noneRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: [],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: []
      };
      var _default = noneRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/noteRole.js
  var require_noteRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/noteRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var noteRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = noteRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/optionRole.js
  var require_optionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/optionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var optionRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-checked": null,
          "aria-posinset": null,
          "aria-setsize": null,
          "aria-selected": "false"
        },
        relatedConcepts: [{
          concept: {
            name: "item"
          },
          module: "XForms"
        }, {
          concept: {
            name: "listitem"
          },
          module: "ARIA"
        }, {
          concept: {
            name: "option"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-selected": "false"
        },
        superClass: [["roletype", "widget", "input"]]
      };
      var _default = optionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/paragraphRole.js
  var require_paragraphRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/paragraphRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var paragraphRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "p"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = paragraphRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/presentationRole.js
  var require_presentationRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/presentationRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var presentationRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "alt",
              value: ""
            }],
            name: "img"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = presentationRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/progressbarRole.js
  var require_progressbarRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/progressbarRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var progressbarRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-valuetext": null
        },
        relatedConcepts: [{
          concept: {
            name: "progress"
          },
          module: "HTML"
        }, {
          concept: {
            name: "status"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "range"], ["roletype", "widget"]]
      };
      var _default = progressbarRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/radioRole.js
  var require_radioRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/radioRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var radioRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-checked": null,
          "aria-posinset": null,
          "aria-setsize": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "type",
              value: "radio"
            }],
            name: "input"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-checked": null
        },
        superClass: [["roletype", "widget", "input"]]
      };
      var _default = radioRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/radiogroupRole.js
  var require_radiogroupRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/radiogroupRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var radiogroupRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-required": null
        },
        relatedConcepts: [{
          concept: {
            name: "list"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["radio"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
      };
      var _default = radiogroupRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/regionRole.js
  var require_regionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/regionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var regionRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-label"
            }],
            name: "section"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["set"],
              name: "aria-labelledby"
            }],
            name: "section"
          },
          module: "HTML"
        }, {
          concept: {
            name: "Device Independence Glossart perceivable unit"
          }
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = regionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/rowRole.js
  var require_rowRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/rowRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var rowRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-colindex": null,
          "aria-expanded": null,
          "aria-level": null,
          "aria-posinset": null,
          "aria-rowindex": null,
          "aria-selected": null,
          "aria-setsize": null
        },
        relatedConcepts: [{
          concept: {
            name: "tr"
          },
          module: "HTML"
        }],
        requireContextRole: ["grid", "rowgroup", "table", "treegrid"],
        requiredContextRole: ["grid", "rowgroup", "table", "treegrid"],
        requiredOwnedElements: [["cell"], ["columnheader"], ["gridcell"], ["rowheader"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "group"], ["roletype", "widget"]]
      };
      var _default = rowRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/rowgroupRole.js
  var require_rowgroupRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/rowgroupRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var rowgroupRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "tbody"
          },
          module: "HTML"
        }, {
          concept: {
            name: "tfoot"
          },
          module: "HTML"
        }, {
          concept: {
            name: "thead"
          },
          module: "HTML"
        }],
        requireContextRole: ["grid", "table", "treegrid"],
        requiredContextRole: ["grid", "table", "treegrid"],
        requiredOwnedElements: [["row"]],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = rowgroupRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/rowheaderRole.js
  var require_rowheaderRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/rowheaderRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var rowheaderRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-sort": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "scope",
              value: "row"
            }],
            name: "th"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              name: "scope",
              value: "rowgroup"
            }],
            name: "th"
          },
          module: "HTML"
        }],
        requireContextRole: ["row", "rowgroup"],
        requiredContextRole: ["row", "rowgroup"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "cell"], ["roletype", "structure", "section", "cell", "gridcell"], ["roletype", "widget", "gridcell"], ["roletype", "structure", "sectionhead"]]
      };
      var _default = rowheaderRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/scrollbarRole.js
  var require_scrollbarRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/scrollbarRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var scrollbarRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-valuetext": null,
          "aria-orientation": "vertical",
          "aria-valuemax": "100",
          "aria-valuemin": "0"
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-controls": null,
          "aria-valuenow": null
        },
        superClass: [["roletype", "structure", "range"], ["roletype", "widget"]]
      };
      var _default = scrollbarRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/searchRole.js
  var require_searchRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/searchRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var searchRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = searchRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/searchboxRole.js
  var require_searchboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/searchboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var searchboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "list"
            }, {
              name: "type",
              value: "search"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "input", "textbox"]]
      };
      var _default = searchboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/separatorRole.js
  var require_separatorRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/separatorRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var separatorRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-orientation": "horizontal",
          "aria-valuemax": "100",
          "aria-valuemin": "0",
          "aria-valuenow": null,
          "aria-valuetext": null
        },
        relatedConcepts: [{
          concept: {
            name: "hr"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure"]]
      };
      var _default = separatorRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/sliderRole.js
  var require_sliderRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/sliderRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var sliderRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-haspopup": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-valuetext": null,
          "aria-orientation": "horizontal",
          "aria-valuemax": "100",
          "aria-valuemin": "0"
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "type",
              value: "range"
            }],
            name: "input"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-valuenow": null
        },
        superClass: [["roletype", "widget", "input"], ["roletype", "structure", "range"]]
      };
      var _default = sliderRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/spinbuttonRole.js
  var require_spinbuttonRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/spinbuttonRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var spinbuttonRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null,
          "aria-readonly": null,
          "aria-required": null,
          "aria-valuetext": null,
          "aria-valuenow": "0"
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              name: "type",
              value: "number"
            }],
            name: "input"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite"], ["roletype", "widget", "input"], ["roletype", "structure", "range"]]
      };
      var _default = spinbuttonRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/statusRole.js
  var require_statusRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/statusRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var statusRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-atomic": "true",
          "aria-live": "polite"
        },
        relatedConcepts: [{
          concept: {
            name: "output"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = statusRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/strongRole.js
  var require_strongRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/strongRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var strongRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "strong"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = strongRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/subscriptRole.js
  var require_subscriptRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/subscriptRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var subscriptRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "sub"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = subscriptRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/superscriptRole.js
  var require_superscriptRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/superscriptRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var superscriptRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["prohibited"],
        prohibitedProps: ["aria-label", "aria-labelledby"],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "sup"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = superscriptRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/switchRole.js
  var require_switchRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/switchRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var switchRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "button"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-checked": null
        },
        superClass: [["roletype", "widget", "input", "checkbox"]]
      };
      var _default = switchRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/tabRole.js
  var require_tabRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/tabRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var tabRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-posinset": null,
          "aria-setsize": null,
          "aria-selected": "false"
        },
        relatedConcepts: [],
        requireContextRole: ["tablist"],
        requiredContextRole: ["tablist"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "sectionhead"], ["roletype", "widget"]]
      };
      var _default = tabRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/tableRole.js
  var require_tableRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/tableRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var tableRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-colcount": null,
          "aria-rowcount": null
        },
        relatedConcepts: [{
          concept: {
            name: "table"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["row"], ["row", "rowgroup"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = tableRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/tablistRole.js
  var require_tablistRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/tablistRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var tablistRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-level": null,
          "aria-multiselectable": null,
          "aria-orientation": "horizontal"
        },
        relatedConcepts: [{
          module: "DAISY",
          concept: {
            name: "guide"
          }
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["tab"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite"]]
      };
      var _default = tablistRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/tabpanelRole.js
  var require_tabpanelRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/tabpanelRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var tabpanelRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = tabpanelRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/termRole.js
  var require_termRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/termRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var termRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "dfn"
          },
          module: "HTML"
        }, {
          concept: {
            name: "dt"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = termRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/textboxRole.js
  var require_textboxRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/textboxRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var textboxRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-activedescendant": null,
          "aria-autocomplete": null,
          "aria-errormessage": null,
          "aria-haspopup": null,
          "aria-invalid": null,
          "aria-multiline": null,
          "aria-placeholder": null,
          "aria-readonly": null,
          "aria-required": null
        },
        relatedConcepts: [{
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "type"
            }, {
              constraints: ["undefined"],
              name: "list"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "list"
            }, {
              name: "type",
              value: "email"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "list"
            }, {
              name: "type",
              value: "tel"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "list"
            }, {
              name: "type",
              value: "text"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            attributes: [{
              constraints: ["undefined"],
              name: "list"
            }, {
              name: "type",
              value: "url"
            }],
            constraints: ["the list attribute is not set"],
            name: "input"
          },
          module: "HTML"
        }, {
          concept: {
            name: "input"
          },
          module: "XForms"
        }, {
          concept: {
            name: "textarea"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "input"]]
      };
      var _default = textboxRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/timeRole.js
  var require_timeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/timeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var timeRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "time"
          },
          module: "HTML"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = timeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/timerRole.js
  var require_timerRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/timerRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var timerRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "status"]]
      };
      var _default = timerRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/toolbarRole.js
  var require_toolbarRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/toolbarRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var toolbarRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-orientation": "horizontal"
        },
        relatedConcepts: [{
          concept: {
            name: "menubar"
          },
          module: "ARIA"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "group"]]
      };
      var _default = toolbarRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/tooltipRole.js
  var require_tooltipRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/tooltipRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var tooltipRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = tooltipRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/treeRole.js
  var require_treeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/treeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var treeRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null,
          "aria-multiselectable": null,
          "aria-required": null,
          "aria-orientation": "vertical"
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["treeitem", "group"], ["treeitem"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "select"], ["roletype", "structure", "section", "group", "select"]]
      };
      var _default = treeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/treegridRole.js
  var require_treegridRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/treegridRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var treegridRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["row"], ["row", "rowgroup"]],
        requiredProps: {},
        superClass: [["roletype", "widget", "composite", "grid"], ["roletype", "structure", "section", "table", "grid"], ["roletype", "widget", "composite", "select", "tree"], ["roletype", "structure", "section", "group", "select", "tree"]]
      };
      var _default = treegridRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/literal/treeitemRole.js
  var require_treeitemRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/literal/treeitemRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var treeitemRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-expanded": null,
          "aria-haspopup": null
        },
        relatedConcepts: [],
        requireContextRole: ["group", "tree"],
        requiredContextRole: ["group", "tree"],
        requiredOwnedElements: [],
        requiredProps: {
          "aria-selected": null
        },
        superClass: [["roletype", "structure", "section", "listitem"], ["roletype", "widget", "input", "option"]]
      };
      var _default = treeitemRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/ariaLiteralRoles.js
  var require_ariaLiteralRoles = __commonJS({
    "node_modules/aria-query/lib/etc/roles/ariaLiteralRoles.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _alertRole = _interopRequireDefault(require_alertRole());
      var _alertdialogRole = _interopRequireDefault(require_alertdialogRole());
      var _applicationRole = _interopRequireDefault(require_applicationRole());
      var _articleRole = _interopRequireDefault(require_articleRole());
      var _bannerRole = _interopRequireDefault(require_bannerRole());
      var _blockquoteRole = _interopRequireDefault(require_blockquoteRole());
      var _buttonRole = _interopRequireDefault(require_buttonRole());
      var _captionRole = _interopRequireDefault(require_captionRole());
      var _cellRole = _interopRequireDefault(require_cellRole());
      var _checkboxRole = _interopRequireDefault(require_checkboxRole());
      var _codeRole = _interopRequireDefault(require_codeRole());
      var _columnheaderRole = _interopRequireDefault(require_columnheaderRole());
      var _comboboxRole = _interopRequireDefault(require_comboboxRole());
      var _complementaryRole = _interopRequireDefault(require_complementaryRole());
      var _contentinfoRole = _interopRequireDefault(require_contentinfoRole());
      var _definitionRole = _interopRequireDefault(require_definitionRole());
      var _deletionRole = _interopRequireDefault(require_deletionRole());
      var _dialogRole = _interopRequireDefault(require_dialogRole());
      var _directoryRole = _interopRequireDefault(require_directoryRole());
      var _documentRole = _interopRequireDefault(require_documentRole());
      var _emphasisRole = _interopRequireDefault(require_emphasisRole());
      var _feedRole = _interopRequireDefault(require_feedRole());
      var _figureRole = _interopRequireDefault(require_figureRole());
      var _formRole = _interopRequireDefault(require_formRole());
      var _genericRole = _interopRequireDefault(require_genericRole());
      var _gridRole = _interopRequireDefault(require_gridRole());
      var _gridcellRole = _interopRequireDefault(require_gridcellRole());
      var _groupRole = _interopRequireDefault(require_groupRole());
      var _headingRole = _interopRequireDefault(require_headingRole());
      var _imgRole = _interopRequireDefault(require_imgRole());
      var _insertionRole = _interopRequireDefault(require_insertionRole());
      var _linkRole = _interopRequireDefault(require_linkRole());
      var _listRole = _interopRequireDefault(require_listRole());
      var _listboxRole = _interopRequireDefault(require_listboxRole());
      var _listitemRole = _interopRequireDefault(require_listitemRole());
      var _logRole = _interopRequireDefault(require_logRole());
      var _mainRole = _interopRequireDefault(require_mainRole());
      var _markRole = _interopRequireDefault(require_markRole());
      var _marqueeRole = _interopRequireDefault(require_marqueeRole());
      var _mathRole = _interopRequireDefault(require_mathRole());
      var _menuRole = _interopRequireDefault(require_menuRole());
      var _menubarRole = _interopRequireDefault(require_menubarRole());
      var _menuitemRole = _interopRequireDefault(require_menuitemRole());
      var _menuitemcheckboxRole = _interopRequireDefault(require_menuitemcheckboxRole());
      var _menuitemradioRole = _interopRequireDefault(require_menuitemradioRole());
      var _meterRole = _interopRequireDefault(require_meterRole());
      var _navigationRole = _interopRequireDefault(require_navigationRole());
      var _noneRole = _interopRequireDefault(require_noneRole());
      var _noteRole = _interopRequireDefault(require_noteRole());
      var _optionRole = _interopRequireDefault(require_optionRole());
      var _paragraphRole = _interopRequireDefault(require_paragraphRole());
      var _presentationRole = _interopRequireDefault(require_presentationRole());
      var _progressbarRole = _interopRequireDefault(require_progressbarRole());
      var _radioRole = _interopRequireDefault(require_radioRole());
      var _radiogroupRole = _interopRequireDefault(require_radiogroupRole());
      var _regionRole = _interopRequireDefault(require_regionRole());
      var _rowRole = _interopRequireDefault(require_rowRole());
      var _rowgroupRole = _interopRequireDefault(require_rowgroupRole());
      var _rowheaderRole = _interopRequireDefault(require_rowheaderRole());
      var _scrollbarRole = _interopRequireDefault(require_scrollbarRole());
      var _searchRole = _interopRequireDefault(require_searchRole());
      var _searchboxRole = _interopRequireDefault(require_searchboxRole());
      var _separatorRole = _interopRequireDefault(require_separatorRole());
      var _sliderRole = _interopRequireDefault(require_sliderRole());
      var _spinbuttonRole = _interopRequireDefault(require_spinbuttonRole());
      var _statusRole = _interopRequireDefault(require_statusRole());
      var _strongRole = _interopRequireDefault(require_strongRole());
      var _subscriptRole = _interopRequireDefault(require_subscriptRole());
      var _superscriptRole = _interopRequireDefault(require_superscriptRole());
      var _switchRole = _interopRequireDefault(require_switchRole());
      var _tabRole = _interopRequireDefault(require_tabRole());
      var _tableRole = _interopRequireDefault(require_tableRole());
      var _tablistRole = _interopRequireDefault(require_tablistRole());
      var _tabpanelRole = _interopRequireDefault(require_tabpanelRole());
      var _termRole = _interopRequireDefault(require_termRole());
      var _textboxRole = _interopRequireDefault(require_textboxRole());
      var _timeRole = _interopRequireDefault(require_timeRole());
      var _timerRole = _interopRequireDefault(require_timerRole());
      var _toolbarRole = _interopRequireDefault(require_toolbarRole());
      var _tooltipRole = _interopRequireDefault(require_tooltipRole());
      var _treeRole = _interopRequireDefault(require_treeRole());
      var _treegridRole = _interopRequireDefault(require_treegridRole());
      var _treeitemRole = _interopRequireDefault(require_treeitemRole());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var ariaLiteralRoles = [["alert", _alertRole.default], ["alertdialog", _alertdialogRole.default], ["application", _applicationRole.default], ["article", _articleRole.default], ["banner", _bannerRole.default], ["blockquote", _blockquoteRole.default], ["button", _buttonRole.default], ["caption", _captionRole.default], ["cell", _cellRole.default], ["checkbox", _checkboxRole.default], ["code", _codeRole.default], ["columnheader", _columnheaderRole.default], ["combobox", _comboboxRole.default], ["complementary", _complementaryRole.default], ["contentinfo", _contentinfoRole.default], ["definition", _definitionRole.default], ["deletion", _deletionRole.default], ["dialog", _dialogRole.default], ["directory", _directoryRole.default], ["document", _documentRole.default], ["emphasis", _emphasisRole.default], ["feed", _feedRole.default], ["figure", _figureRole.default], ["form", _formRole.default], ["generic", _genericRole.default], ["grid", _gridRole.default], ["gridcell", _gridcellRole.default], ["group", _groupRole.default], ["heading", _headingRole.default], ["img", _imgRole.default], ["insertion", _insertionRole.default], ["link", _linkRole.default], ["list", _listRole.default], ["listbox", _listboxRole.default], ["listitem", _listitemRole.default], ["log", _logRole.default], ["main", _mainRole.default], ["mark", _markRole.default], ["marquee", _marqueeRole.default], ["math", _mathRole.default], ["menu", _menuRole.default], ["menubar", _menubarRole.default], ["menuitem", _menuitemRole.default], ["menuitemcheckbox", _menuitemcheckboxRole.default], ["menuitemradio", _menuitemradioRole.default], ["meter", _meterRole.default], ["navigation", _navigationRole.default], ["none", _noneRole.default], ["note", _noteRole.default], ["option", _optionRole.default], ["paragraph", _paragraphRole.default], ["presentation", _presentationRole.default], ["progressbar", _progressbarRole.default], ["radio", _radioRole.default], ["radiogroup", _radiogroupRole.default], ["region", _regionRole.default], ["row", _rowRole.default], ["rowgroup", _rowgroupRole.default], ["rowheader", _rowheaderRole.default], ["scrollbar", _scrollbarRole.default], ["search", _searchRole.default], ["searchbox", _searchboxRole.default], ["separator", _separatorRole.default], ["slider", _sliderRole.default], ["spinbutton", _spinbuttonRole.default], ["status", _statusRole.default], ["strong", _strongRole.default], ["subscript", _subscriptRole.default], ["superscript", _superscriptRole.default], ["switch", _switchRole.default], ["tab", _tabRole.default], ["table", _tableRole.default], ["tablist", _tablistRole.default], ["tabpanel", _tabpanelRole.default], ["term", _termRole.default], ["textbox", _textboxRole.default], ["time", _timeRole.default], ["timer", _timerRole.default], ["toolbar", _toolbarRole.default], ["tooltip", _tooltipRole.default], ["tree", _treeRole.default], ["treegrid", _treegridRole.default], ["treeitem", _treeitemRole.default]];
      var _default = ariaLiteralRoles;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docAbstractRole.js
  var require_docAbstractRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docAbstractRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docAbstractRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "abstract [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docAbstractRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docAcknowledgmentsRole.js
  var require_docAcknowledgmentsRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docAcknowledgmentsRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docAcknowledgmentsRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "acknowledgments [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docAcknowledgmentsRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docAfterwordRole.js
  var require_docAfterwordRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docAfterwordRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docAfterwordRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "afterword [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docAfterwordRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docAppendixRole.js
  var require_docAppendixRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docAppendixRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docAppendixRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "appendix [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docAppendixRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docBacklinkRole.js
  var require_docBacklinkRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docBacklinkRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docBacklinkRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "referrer [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command", "link"]]
      };
      var _default = docBacklinkRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docBiblioentryRole.js
  var require_docBiblioentryRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docBiblioentryRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docBiblioentryRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "EPUB biblioentry [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: ["doc-bibliography"],
        requiredContextRole: ["doc-bibliography"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "listitem"]]
      };
      var _default = docBiblioentryRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docBibliographyRole.js
  var require_docBibliographyRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docBibliographyRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docBibliographyRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "bibliography [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["doc-biblioentry"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docBibliographyRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docBibliorefRole.js
  var require_docBibliorefRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docBibliorefRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docBibliorefRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "biblioref [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command", "link"]]
      };
      var _default = docBibliorefRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docChapterRole.js
  var require_docChapterRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docChapterRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docChapterRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "chapter [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docChapterRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docColophonRole.js
  var require_docColophonRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docColophonRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docColophonRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "colophon [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docColophonRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docConclusionRole.js
  var require_docConclusionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docConclusionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docConclusionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "conclusion [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docConclusionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docCoverRole.js
  var require_docCoverRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docCoverRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docCoverRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "cover [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "img"]]
      };
      var _default = docCoverRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docCreditRole.js
  var require_docCreditRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docCreditRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docCreditRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "credit [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docCreditRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docCreditsRole.js
  var require_docCreditsRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docCreditsRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docCreditsRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "credits [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docCreditsRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docDedicationRole.js
  var require_docDedicationRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docDedicationRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docDedicationRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "dedication [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docDedicationRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docEndnoteRole.js
  var require_docEndnoteRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docEndnoteRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docEndnoteRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "rearnote [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: ["doc-endnotes"],
        requiredContextRole: ["doc-endnotes"],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "listitem"]]
      };
      var _default = docEndnoteRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docEndnotesRole.js
  var require_docEndnotesRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docEndnotesRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docEndnotesRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "rearnotes [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["doc-endnote"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docEndnotesRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docEpigraphRole.js
  var require_docEpigraphRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docEpigraphRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docEpigraphRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "epigraph [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docEpigraphRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docEpilogueRole.js
  var require_docEpilogueRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docEpilogueRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docEpilogueRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "epilogue [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docEpilogueRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docErrataRole.js
  var require_docErrataRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docErrataRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docErrataRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "errata [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docErrataRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docExampleRole.js
  var require_docExampleRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docExampleRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docExampleRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docExampleRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docFootnoteRole.js
  var require_docFootnoteRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docFootnoteRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docFootnoteRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "footnote [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docFootnoteRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docForewordRole.js
  var require_docForewordRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docForewordRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docForewordRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "foreword [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docForewordRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docGlossaryRole.js
  var require_docGlossaryRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docGlossaryRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docGlossaryRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "glossary [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [["definition"], ["term"]],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docGlossaryRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docGlossrefRole.js
  var require_docGlossrefRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docGlossrefRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docGlossrefRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "glossref [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command", "link"]]
      };
      var _default = docGlossrefRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docIndexRole.js
  var require_docIndexRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docIndexRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docIndexRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "index [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
      };
      var _default = docIndexRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docIntroductionRole.js
  var require_docIntroductionRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docIntroductionRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docIntroductionRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "introduction [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docIntroductionRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docNoterefRole.js
  var require_docNoterefRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docNoterefRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docNoterefRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "noteref [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "widget", "command", "link"]]
      };
      var _default = docNoterefRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docNoticeRole.js
  var require_docNoticeRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docNoticeRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docNoticeRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "notice [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "note"]]
      };
      var _default = docNoticeRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPagebreakRole.js
  var require_docPagebreakRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPagebreakRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPagebreakRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "pagebreak [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "separator"]]
      };
      var _default = docPagebreakRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPagelistRole.js
  var require_docPagelistRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPagelistRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPagelistRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "page-list [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
      };
      var _default = docPagelistRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPartRole.js
  var require_docPartRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPartRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPartRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "part [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docPartRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPrefaceRole.js
  var require_docPrefaceRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPrefaceRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPrefaceRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "preface [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docPrefaceRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPrologueRole.js
  var require_docPrologueRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPrologueRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPrologueRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "prologue [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark"]]
      };
      var _default = docPrologueRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docPullquoteRole.js
  var require_docPullquoteRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docPullquoteRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docPullquoteRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {},
        relatedConcepts: [{
          concept: {
            name: "pullquote [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["none"]]
      };
      var _default = docPullquoteRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docQnaRole.js
  var require_docQnaRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docQnaRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docQnaRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "qna [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section"]]
      };
      var _default = docQnaRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docSubtitleRole.js
  var require_docSubtitleRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docSubtitleRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docSubtitleRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "subtitle [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "sectionhead"]]
      };
      var _default = docSubtitleRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docTipRole.js
  var require_docTipRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docTipRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docTipRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "help [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "note"]]
      };
      var _default = docTipRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/dpub/docTocRole.js
  var require_docTocRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/dpub/docTocRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var docTocRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          concept: {
            name: "toc [EPUB-SSV]"
          },
          module: "EPUB"
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "landmark", "navigation"]]
      };
      var _default = docTocRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/ariaDpubRoles.js
  var require_ariaDpubRoles = __commonJS({
    "node_modules/aria-query/lib/etc/roles/ariaDpubRoles.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _docAbstractRole = _interopRequireDefault(require_docAbstractRole());
      var _docAcknowledgmentsRole = _interopRequireDefault(require_docAcknowledgmentsRole());
      var _docAfterwordRole = _interopRequireDefault(require_docAfterwordRole());
      var _docAppendixRole = _interopRequireDefault(require_docAppendixRole());
      var _docBacklinkRole = _interopRequireDefault(require_docBacklinkRole());
      var _docBiblioentryRole = _interopRequireDefault(require_docBiblioentryRole());
      var _docBibliographyRole = _interopRequireDefault(require_docBibliographyRole());
      var _docBibliorefRole = _interopRequireDefault(require_docBibliorefRole());
      var _docChapterRole = _interopRequireDefault(require_docChapterRole());
      var _docColophonRole = _interopRequireDefault(require_docColophonRole());
      var _docConclusionRole = _interopRequireDefault(require_docConclusionRole());
      var _docCoverRole = _interopRequireDefault(require_docCoverRole());
      var _docCreditRole = _interopRequireDefault(require_docCreditRole());
      var _docCreditsRole = _interopRequireDefault(require_docCreditsRole());
      var _docDedicationRole = _interopRequireDefault(require_docDedicationRole());
      var _docEndnoteRole = _interopRequireDefault(require_docEndnoteRole());
      var _docEndnotesRole = _interopRequireDefault(require_docEndnotesRole());
      var _docEpigraphRole = _interopRequireDefault(require_docEpigraphRole());
      var _docEpilogueRole = _interopRequireDefault(require_docEpilogueRole());
      var _docErrataRole = _interopRequireDefault(require_docErrataRole());
      var _docExampleRole = _interopRequireDefault(require_docExampleRole());
      var _docFootnoteRole = _interopRequireDefault(require_docFootnoteRole());
      var _docForewordRole = _interopRequireDefault(require_docForewordRole());
      var _docGlossaryRole = _interopRequireDefault(require_docGlossaryRole());
      var _docGlossrefRole = _interopRequireDefault(require_docGlossrefRole());
      var _docIndexRole = _interopRequireDefault(require_docIndexRole());
      var _docIntroductionRole = _interopRequireDefault(require_docIntroductionRole());
      var _docNoterefRole = _interopRequireDefault(require_docNoterefRole());
      var _docNoticeRole = _interopRequireDefault(require_docNoticeRole());
      var _docPagebreakRole = _interopRequireDefault(require_docPagebreakRole());
      var _docPagelistRole = _interopRequireDefault(require_docPagelistRole());
      var _docPartRole = _interopRequireDefault(require_docPartRole());
      var _docPrefaceRole = _interopRequireDefault(require_docPrefaceRole());
      var _docPrologueRole = _interopRequireDefault(require_docPrologueRole());
      var _docPullquoteRole = _interopRequireDefault(require_docPullquoteRole());
      var _docQnaRole = _interopRequireDefault(require_docQnaRole());
      var _docSubtitleRole = _interopRequireDefault(require_docSubtitleRole());
      var _docTipRole = _interopRequireDefault(require_docTipRole());
      var _docTocRole = _interopRequireDefault(require_docTocRole());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var ariaDpubRoles = [["doc-abstract", _docAbstractRole.default], ["doc-acknowledgments", _docAcknowledgmentsRole.default], ["doc-afterword", _docAfterwordRole.default], ["doc-appendix", _docAppendixRole.default], ["doc-backlink", _docBacklinkRole.default], ["doc-biblioentry", _docBiblioentryRole.default], ["doc-bibliography", _docBibliographyRole.default], ["doc-biblioref", _docBibliorefRole.default], ["doc-chapter", _docChapterRole.default], ["doc-colophon", _docColophonRole.default], ["doc-conclusion", _docConclusionRole.default], ["doc-cover", _docCoverRole.default], ["doc-credit", _docCreditRole.default], ["doc-credits", _docCreditsRole.default], ["doc-dedication", _docDedicationRole.default], ["doc-endnote", _docEndnoteRole.default], ["doc-endnotes", _docEndnotesRole.default], ["doc-epigraph", _docEpigraphRole.default], ["doc-epilogue", _docEpilogueRole.default], ["doc-errata", _docErrataRole.default], ["doc-example", _docExampleRole.default], ["doc-footnote", _docFootnoteRole.default], ["doc-foreword", _docForewordRole.default], ["doc-glossary", _docGlossaryRole.default], ["doc-glossref", _docGlossrefRole.default], ["doc-index", _docIndexRole.default], ["doc-introduction", _docIntroductionRole.default], ["doc-noteref", _docNoterefRole.default], ["doc-notice", _docNoticeRole.default], ["doc-pagebreak", _docPagebreakRole.default], ["doc-pagelist", _docPagelistRole.default], ["doc-part", _docPartRole.default], ["doc-preface", _docPrefaceRole.default], ["doc-prologue", _docPrologueRole.default], ["doc-pullquote", _docPullquoteRole.default], ["doc-qna", _docQnaRole.default], ["doc-subtitle", _docSubtitleRole.default], ["doc-tip", _docTipRole.default], ["doc-toc", _docTocRole.default]];
      var _default = ariaDpubRoles;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/graphics/graphicsDocumentRole.js
  var require_graphicsDocumentRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/graphics/graphicsDocumentRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var graphicsDocumentRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          module: "GRAPHICS",
          concept: {
            name: "graphics-object"
          }
        }, {
          module: "ARIA",
          concept: {
            name: "img"
          }
        }, {
          module: "ARIA",
          concept: {
            name: "article"
          }
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "document"]]
      };
      var _default = graphicsDocumentRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/graphics/graphicsObjectRole.js
  var require_graphicsObjectRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/graphics/graphicsObjectRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var graphicsObjectRole = {
        abstract: false,
        accessibleNameRequired: false,
        baseConcepts: [],
        childrenPresentational: false,
        nameFrom: ["author", "contents"],
        prohibitedProps: [],
        props: {
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [{
          module: "GRAPHICS",
          concept: {
            name: "graphics-document"
          }
        }, {
          module: "ARIA",
          concept: {
            name: "group"
          }
        }, {
          module: "ARIA",
          concept: {
            name: "img"
          }
        }, {
          module: "GRAPHICS",
          concept: {
            name: "graphics-symbol"
          }
        }],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "group"]]
      };
      var _default = graphicsObjectRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/graphics/graphicsSymbolRole.js
  var require_graphicsSymbolRole = __commonJS({
    "node_modules/aria-query/lib/etc/roles/graphics/graphicsSymbolRole.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var graphicsSymbolRole = {
        abstract: false,
        accessibleNameRequired: true,
        baseConcepts: [],
        childrenPresentational: true,
        nameFrom: ["author"],
        prohibitedProps: [],
        props: {
          "aria-disabled": null,
          "aria-errormessage": null,
          "aria-expanded": null,
          "aria-haspopup": null,
          "aria-invalid": null
        },
        relatedConcepts: [],
        requireContextRole: [],
        requiredContextRole: [],
        requiredOwnedElements: [],
        requiredProps: {},
        superClass: [["roletype", "structure", "section", "img"]]
      };
      var _default = graphicsSymbolRole;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/etc/roles/ariaGraphicsRoles.js
  var require_ariaGraphicsRoles = __commonJS({
    "node_modules/aria-query/lib/etc/roles/ariaGraphicsRoles.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _graphicsDocumentRole = _interopRequireDefault(require_graphicsDocumentRole());
      var _graphicsObjectRole = _interopRequireDefault(require_graphicsObjectRole());
      var _graphicsSymbolRole = _interopRequireDefault(require_graphicsSymbolRole());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var ariaGraphicsRoles = [["graphics-document", _graphicsDocumentRole.default], ["graphics-object", _graphicsObjectRole.default], ["graphics-symbol", _graphicsSymbolRole.default]];
      var _default = ariaGraphicsRoles;
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/rolesMap.js
  var require_rolesMap = __commonJS({
    "node_modules/aria-query/lib/rolesMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _ariaAbstractRoles = _interopRequireDefault(require_ariaAbstractRoles());
      var _ariaLiteralRoles = _interopRequireDefault(require_ariaLiteralRoles());
      var _ariaDpubRoles = _interopRequireDefault(require_ariaDpubRoles());
      var _ariaGraphicsRoles = _interopRequireDefault(require_ariaGraphicsRoles());
      var _iterationDecorator = _interopRequireDefault(require_iterationDecorator());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F2() {
            };
            return { s: F, n: function n() {
              if (i >= o.length) return { done: true };
              return { done: false, value: o[i++] };
            }, e: function e(_e2) {
              throw _e2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true, didErr = false, err;
        return { s: function s() {
          it = it.call(o);
        }, n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        }, e: function e(_e3) {
          didErr = true;
          err = _e3;
        }, f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        } };
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
      function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      var roles = [].concat(_ariaAbstractRoles.default, _ariaLiteralRoles.default, _ariaDpubRoles.default, _ariaGraphicsRoles.default);
      roles.forEach(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), roleDefinition = _ref2[1];
        var _iterator = _createForOfIteratorHelper(roleDefinition.superClass), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var superClassIter = _step.value;
            var _iterator2 = _createForOfIteratorHelper(superClassIter), _step2;
            try {
              var _loop = function _loop2() {
                var superClassName = _step2.value;
                var superClassRoleTuple = roles.find(function(_ref3) {
                  var _ref4 = _slicedToArray(_ref3, 1), name = _ref4[0];
                  return name === superClassName;
                });
                if (superClassRoleTuple) {
                  var superClassDefinition = superClassRoleTuple[1];
                  for (var _i2 = 0, _Object$keys = Object.keys(superClassDefinition.props); _i2 < _Object$keys.length; _i2++) {
                    var prop = _Object$keys[_i2];
                    if (
                      // $FlowIssue Accessing the hasOwnProperty on the Object prototype is fine.
                      !Object.prototype.hasOwnProperty.call(roleDefinition.props, prop)
                    ) {
                      Object.assign(roleDefinition.props, _defineProperty({}, prop, superClassDefinition.props[prop]));
                    }
                  }
                }
              };
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                _loop();
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      var rolesMap = {
        entries: function entries() {
          return roles;
        },
        forEach: function forEach(fn) {
          var thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          var _iterator3 = _createForOfIteratorHelper(roles), _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
              var _step3$value = _slicedToArray(_step3.value, 2), key = _step3$value[0], values = _step3$value[1];
              fn.call(thisArg, values, key, roles);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        },
        get: function get(key) {
          var item = roles.find(function(tuple) {
            return tuple[0] === key ? true : false;
          });
          return item && item[1];
        },
        has: function has(key) {
          return !!rolesMap.get(key);
        },
        keys: function keys() {
          return roles.map(function(_ref5) {
            var _ref6 = _slicedToArray(_ref5, 1), key = _ref6[0];
            return key;
          });
        },
        values: function values() {
          return roles.map(function(_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2), values2 = _ref8[1];
            return values2;
          });
        }
      };
      var _default = (0, _iterationDecorator.default)(rolesMap, rolesMap.entries());
      exports.default = _default;
    }
  });

  // node_modules/dequal/lite/index.js
  var require_lite = __commonJS({
    "node_modules/dequal/lite/index.js"(exports) {
      var has = Object.prototype.hasOwnProperty;
      function dequal(foo, bar) {
        var ctor, len;
        if (foo === bar) return true;
        if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
          if (ctor === Date) return foo.getTime() === bar.getTime();
          if (ctor === RegExp) return foo.toString() === bar.toString();
          if (ctor === Array) {
            if ((len = foo.length) === bar.length) {
              while (len-- && dequal(foo[len], bar[len])) ;
            }
            return len === -1;
          }
          if (!ctor || typeof foo === "object") {
            len = 0;
            for (ctor in foo) {
              if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
              if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
            }
            return Object.keys(bar).length === len;
          }
        }
        return foo !== foo && bar !== bar;
      }
      exports.dequal = dequal;
    }
  });

  // node_modules/aria-query/lib/elementRoleMap.js
  var require_elementRoleMap = __commonJS({
    "node_modules/aria-query/lib/elementRoleMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _lite = require_lite();
      var _iterationDecorator = _interopRequireDefault(require_iterationDecorator());
      var _rolesMap = _interopRequireDefault(require_rolesMap());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _slicedToArray(arr, i2) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArrayLimit(arr, i2) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i2 && _arr.length === i2) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i2 = 0;
            var F = function F2() {
            };
            return { s: F, n: function n() {
              if (i2 >= o.length) return { done: true };
              return { done: false, value: o[i2++] };
            }, e: function e(_e2) {
              throw _e2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true, didErr = false, err;
        return { s: function s() {
          it = it.call(o);
        }, n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        }, e: function e(_e3) {
          didErr = true;
          err = _e3;
        }, f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        } };
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
          arr2[i2] = arr[i2];
        }
        return arr2;
      }
      var elementRoles = [];
      var keys = _rolesMap.default.keys();
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        role = _rolesMap.default.get(key);
        if (role) {
          concepts = [].concat(role.baseConcepts, role.relatedConcepts);
          for (k = 0; k < concepts.length; k++) {
            relation = concepts[k];
            if (relation.module === "HTML") {
              (function() {
                var concept = relation.concept;
                if (concept) {
                  var elementRoleRelation = elementRoles.find(function(relation2) {
                    return (0, _lite.dequal)(relation2, concept);
                  });
                  var roles;
                  if (elementRoleRelation) {
                    roles = elementRoleRelation[1];
                  } else {
                    roles = [];
                  }
                  var isUnique = true;
                  for (var _i = 0; _i < roles.length; _i++) {
                    if (roles[_i] === key) {
                      isUnique = false;
                      break;
                    }
                  }
                  if (isUnique) {
                    roles.push(key);
                  }
                  elementRoles.push([concept, roles]);
                }
              })();
            }
          }
        }
      }
      var key;
      var role;
      var concepts;
      var relation;
      var k;
      var i;
      var elementRoleMap = {
        entries: function entries() {
          return elementRoles;
        },
        forEach: function forEach(fn) {
          var thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          var _iterator = _createForOfIteratorHelper(elementRoles), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var _step$value = _slicedToArray(_step.value, 2), _key = _step$value[0], values = _step$value[1];
              fn.call(thisArg, values, _key, elementRoles);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        },
        get: function get(key2) {
          var item = elementRoles.find(function(tuple) {
            return key2.name === tuple[0].name && (0, _lite.dequal)(key2.attributes, tuple[0].attributes);
          });
          return item && item[1];
        },
        has: function has(key2) {
          return !!elementRoleMap.get(key2);
        },
        keys: function keys2() {
          return elementRoles.map(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 1), key2 = _ref2[0];
            return key2;
          });
        },
        values: function values() {
          return elementRoles.map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
            return values2;
          });
        }
      };
      var _default = (0, _iterationDecorator.default)(elementRoleMap, elementRoleMap.entries());
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/roleElementMap.js
  var require_roleElementMap = __commonJS({
    "node_modules/aria-query/lib/roleElementMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _iterationDecorator = _interopRequireDefault(require_iterationDecorator());
      var _rolesMap = _interopRequireDefault(require_rolesMap());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function _slicedToArray(arr, i2) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArrayLimit(arr, i2) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i2 && _arr.length === i2) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
        if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i2 = 0;
            var F = function F2() {
            };
            return { s: F, n: function n() {
              if (i2 >= o.length) return { done: true };
              return { done: false, value: o[i2++] };
            }, e: function e(_e2) {
              throw _e2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var normalCompletion = true, didErr = false, err;
        return { s: function s() {
          it = it.call(o);
        }, n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        }, e: function e(_e3) {
          didErr = true;
          err = _e3;
        }, f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        } };
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
          arr2[i2] = arr[i2];
        }
        return arr2;
      }
      var roleElement = [];
      var keys = _rolesMap.default.keys();
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        role = _rolesMap.default.get(key);
        relationConcepts = [];
        if (role) {
          concepts = [].concat(role.baseConcepts, role.relatedConcepts);
          for (k = 0; k < concepts.length; k++) {
            relation = concepts[k];
            if (relation.module === "HTML") {
              concept = relation.concept;
              if (concept != null) {
                relationConcepts.push(concept);
              }
            }
          }
          if (relationConcepts.length > 0) {
            roleElement.push([key, relationConcepts]);
          }
        }
      }
      var key;
      var role;
      var relationConcepts;
      var concepts;
      var relation;
      var concept;
      var k;
      var i;
      var roleElementMap = {
        entries: function entries() {
          return roleElement;
        },
        forEach: function forEach(fn) {
          var thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          var _iterator = _createForOfIteratorHelper(roleElement), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var _step$value = _slicedToArray(_step.value, 2), _key = _step$value[0], values = _step$value[1];
              fn.call(thisArg, values, _key, roleElement);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        },
        get: function get(key2) {
          var item = roleElement.find(function(tuple) {
            return tuple[0] === key2 ? true : false;
          });
          return item && item[1];
        },
        has: function has(key2) {
          return !!roleElementMap.get(key2);
        },
        keys: function keys2() {
          return roleElement.map(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 1), key2 = _ref2[0];
            return key2;
          });
        },
        values: function values() {
          return roleElement.map(function(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2), values2 = _ref4[1];
            return values2;
          });
        }
      };
      var _default = (0, _iterationDecorator.default)(roleElementMap, roleElementMap.entries());
      exports.default = _default;
    }
  });

  // node_modules/aria-query/lib/index.js
  var require_lib = __commonJS({
    "node_modules/aria-query/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.roles = exports.roleElements = exports.elementRoles = exports.dom = exports.aria = void 0;
      var _ariaPropsMap = _interopRequireDefault(require_ariaPropsMap());
      var _domMap = _interopRequireDefault(require_domMap());
      var _rolesMap = _interopRequireDefault(require_rolesMap());
      var _elementRoleMap = _interopRequireDefault(require_elementRoleMap());
      var _roleElementMap = _interopRequireDefault(require_roleElementMap());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var aria = _ariaPropsMap.default;
      exports.aria = aria;
      var dom = _domMap.default;
      exports.dom = dom;
      var roles = _rolesMap.default;
      exports.roles = roles;
      var elementRoles = _elementRoleMap.default;
      exports.elementRoles = elementRoles;
      var roleElements = _roleElementMap.default;
      exports.roleElements = roleElements;
    }
  });

  // node_modules/@testing-library/dom/dist/role-helpers.js
  var require_role_helpers = __commonJS({
    "node_modules/@testing-library/dom/dist/role-helpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.computeAriaBusy = computeAriaBusy;
      exports.computeAriaChecked = computeAriaChecked;
      exports.computeAriaCurrent = computeAriaCurrent;
      exports.computeAriaExpanded = computeAriaExpanded;
      exports.computeAriaPressed = computeAriaPressed;
      exports.computeAriaSelected = computeAriaSelected;
      exports.computeAriaValueMax = computeAriaValueMax;
      exports.computeAriaValueMin = computeAriaValueMin;
      exports.computeAriaValueNow = computeAriaValueNow;
      exports.computeAriaValueText = computeAriaValueText;
      exports.computeHeadingLevel = computeHeadingLevel;
      exports.getImplicitAriaRoles = getImplicitAriaRoles;
      exports.getRoles = getRoles;
      exports.isInaccessible = isInaccessible;
      exports.isSubtreeInaccessible = isSubtreeInaccessible;
      exports.logRoles = void 0;
      exports.prettyRoles = prettyRoles;
      var _ariaQuery = require_lib();
      var _domAccessibilityApi = require_dist();
      var _prettyDom = require_pretty_dom();
      var _config = require_config();
      var elementRoleList = buildElementRoleList(_ariaQuery.elementRoles);
      function isSubtreeInaccessible(element) {
        if (element.hidden === true) {
          return true;
        }
        if (element.getAttribute("aria-hidden") === "true") {
          return true;
        }
        const window2 = element.ownerDocument.defaultView;
        if (window2.getComputedStyle(element).display === "none") {
          return true;
        }
        return false;
      }
      function isInaccessible(element, options = {}) {
        const {
          isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible
        } = options;
        const window2 = element.ownerDocument.defaultView;
        if (window2.getComputedStyle(element).visibility === "hidden") {
          return true;
        }
        let currentElement = element;
        while (currentElement) {
          if (isSubtreeInaccessibleImpl(currentElement)) {
            return true;
          }
          currentElement = currentElement.parentElement;
        }
        return false;
      }
      function getImplicitAriaRoles(currentNode) {
        for (const {
          match,
          roles
        } of elementRoleList) {
          if (match(currentNode)) {
            return [...roles];
          }
        }
        return [];
      }
      function buildElementRoleList(elementRolesMap) {
        function makeElementSelector({
          name,
          attributes
        }) {
          return `${name}${attributes.map(({
            name: attributeName,
            value,
            constraints = []
          }) => {
            const shouldNotExist = constraints.indexOf("undefined") !== -1;
            const shouldBeNonEmpty = constraints.indexOf("set") !== -1;
            const hasExplicitValue = typeof value !== "undefined";
            if (hasExplicitValue) {
              return `[${attributeName}="${value}"]`;
            } else if (shouldNotExist) {
              return `:not([${attributeName}])`;
            } else if (shouldBeNonEmpty) {
              return `[${attributeName}]:not([${attributeName}=""])`;
            }
            return `[${attributeName}]`;
          }).join("")}`;
        }
        function getSelectorSpecificity({
          attributes = []
        }) {
          return attributes.length;
        }
        function bySelectorSpecificity({
          specificity: leftSpecificity
        }, {
          specificity: rightSpecificity
        }) {
          return rightSpecificity - leftSpecificity;
        }
        function match(element) {
          let {
            attributes = []
          } = element;
          const typeTextIndex = attributes.findIndex((attribute) => attribute.value && attribute.name === "type" && attribute.value === "text");
          if (typeTextIndex >= 0) {
            attributes = [...attributes.slice(0, typeTextIndex), ...attributes.slice(typeTextIndex + 1)];
          }
          const selector = makeElementSelector({
            ...element,
            attributes
          });
          return (node) => {
            if (typeTextIndex >= 0 && node.type !== "text") {
              return false;
            }
            return node.matches(selector);
          };
        }
        let result = [];
        for (const [element, roles] of elementRolesMap.entries()) {
          result = [...result, {
            match: match(element),
            roles: Array.from(roles),
            specificity: getSelectorSpecificity(element)
          }];
        }
        return result.sort(bySelectorSpecificity);
      }
      function getRoles(container, {
        hidden = false
      } = {}) {
        function flattenDOM(node) {
          return [node, ...Array.from(node.children).reduce((acc, child) => [...acc, ...flattenDOM(child)], [])];
        }
        return flattenDOM(container).filter((element) => {
          return hidden === false ? isInaccessible(element) === false : true;
        }).reduce((acc, node) => {
          let roles = [];
          if (node.hasAttribute("role")) {
            roles = node.getAttribute("role").split(" ").slice(0, 1);
          } else {
            roles = getImplicitAriaRoles(node);
          }
          return roles.reduce((rolesAcc, role) => Array.isArray(rolesAcc[role]) ? {
            ...rolesAcc,
            [role]: [...rolesAcc[role], node]
          } : {
            ...rolesAcc,
            [role]: [node]
          }, acc);
        }, {});
      }
      function prettyRoles(dom, {
        hidden,
        includeDescription
      }) {
        const roles = getRoles(dom, {
          hidden
        });
        return Object.entries(roles).filter(([role]) => role !== "generic").map(([role, elements]) => {
          const delimiterBar = "-".repeat(50);
          const elementsString = elements.map((el) => {
            const nameString = `Name "${(0, _domAccessibilityApi.computeAccessibleName)(el, {
              computedStyleSupportsPseudoElements: (0, _config.getConfig)().computedStyleSupportsPseudoElements
            })}":
`;
            const domString = (0, _prettyDom.prettyDOM)(el.cloneNode(false));
            if (includeDescription) {
              const descriptionString = `Description "${(0, _domAccessibilityApi.computeAccessibleDescription)(el, {
                computedStyleSupportsPseudoElements: (0, _config.getConfig)().computedStyleSupportsPseudoElements
              })}":
`;
              return `${nameString}${descriptionString}${domString}`;
            }
            return `${nameString}${domString}`;
          }).join("\n\n");
          return `${role}:

${elementsString}

${delimiterBar}`;
        }).join("\n");
      }
      var logRoles = (dom, {
        hidden = false
      } = {}) => console.log(prettyRoles(dom, {
        hidden
      }));
      exports.logRoles = logRoles;
      function computeAriaSelected(element) {
        if (element.tagName === "OPTION") {
          return element.selected;
        }
        return checkBooleanAttribute(element, "aria-selected");
      }
      function computeAriaBusy(element) {
        return element.getAttribute("aria-busy") === "true";
      }
      function computeAriaChecked(element) {
        if ("indeterminate" in element && element.indeterminate) {
          return void 0;
        }
        if ("checked" in element) {
          return element.checked;
        }
        return checkBooleanAttribute(element, "aria-checked");
      }
      function computeAriaPressed(element) {
        return checkBooleanAttribute(element, "aria-pressed");
      }
      function computeAriaCurrent(element) {
        return checkBooleanAttribute(element, "aria-current") ?? element.getAttribute("aria-current") ?? false;
      }
      function computeAriaExpanded(element) {
        return checkBooleanAttribute(element, "aria-expanded");
      }
      function checkBooleanAttribute(element, attribute) {
        const attributeValue = element.getAttribute(attribute);
        if (attributeValue === "true") {
          return true;
        }
        if (attributeValue === "false") {
          return false;
        }
        return void 0;
      }
      function computeHeadingLevel(element) {
        const implicitHeadingLevels = {
          H1: 1,
          H2: 2,
          H3: 3,
          H4: 4,
          H5: 5,
          H6: 6
        };
        const ariaLevelAttribute = element.getAttribute("aria-level") && Number(element.getAttribute("aria-level"));
        return ariaLevelAttribute || implicitHeadingLevels[element.tagName];
      }
      function computeAriaValueNow(element) {
        const valueNow = element.getAttribute("aria-valuenow");
        return valueNow === null ? void 0 : +valueNow;
      }
      function computeAriaValueMax(element) {
        const valueMax = element.getAttribute("aria-valuemax");
        return valueMax === null ? void 0 : +valueMax;
      }
      function computeAriaValueMin(element) {
        const valueMin = element.getAttribute("aria-valuemin");
        return valueMin === null ? void 0 : +valueMin;
      }
      function computeAriaValueText(element) {
        const valueText = element.getAttribute("aria-valuetext");
        return valueText === null ? void 0 : valueText;
      }
    }
  });

  // node_modules/@testing-library/dom/dist/suggestions.js
  var require_suggestions = __commonJS({
    "node_modules/@testing-library/dom/dist/suggestions.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getSuggestedQuery = getSuggestedQuery;
      var _domAccessibilityApi = require_dist();
      var _matches = require_matches();
      var _getNodeText = require_get_node_text();
      var _config = require_config();
      var _roleHelpers = require_role_helpers();
      var _labelHelpers = require_label_helpers();
      var normalize = (0, _matches.getDefaultNormalizer)();
      function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
      }
      function getRegExpMatcher(string) {
        return new RegExp(escapeRegExp(string.toLowerCase()), "i");
      }
      function makeSuggestion(queryName, element, content, {
        variant,
        name
      }) {
        let warning = "";
        const queryOptions = {};
        const queryArgs = [["Role", "TestId"].includes(queryName) ? content : getRegExpMatcher(content)];
        if (name) {
          queryOptions.name = getRegExpMatcher(name);
        }
        if (queryName === "Role" && (0, _roleHelpers.isInaccessible)(element)) {
          queryOptions.hidden = true;
          warning = `Element is inaccessible. This means that the element and all its children are invisible to screen readers.
    If you are using the aria-hidden prop, make sure this is the right choice for your case.
    `;
        }
        if (Object.keys(queryOptions).length > 0) {
          queryArgs.push(queryOptions);
        }
        const queryMethod = `${variant}By${queryName}`;
        return {
          queryName,
          queryMethod,
          queryArgs,
          variant,
          warning,
          toString() {
            if (warning) {
              console.warn(warning);
            }
            let [text, options] = queryArgs;
            text = typeof text === "string" ? `'${text}'` : text;
            options = options ? `, { ${Object.entries(options).map(([k, v]) => `${k}: ${v}`).join(", ")} }` : "";
            return `${queryMethod}(${text}${options})`;
          }
        };
      }
      function canSuggest(currentMethod, requestedMethod, data) {
        return data && (!requestedMethod || requestedMethod.toLowerCase() === currentMethod.toLowerCase());
      }
      function getSuggestedQuery(element, variant = "get", method) {
        if (element.matches((0, _config.getConfig)().defaultIgnore)) {
          return void 0;
        }
        const role = element.getAttribute("role") ?? (0, _roleHelpers.getImplicitAriaRoles)(element)?.[0];
        if (role !== "generic" && canSuggest("Role", method, role)) {
          return makeSuggestion("Role", element, role, {
            variant,
            name: (0, _domAccessibilityApi.computeAccessibleName)(element, {
              computedStyleSupportsPseudoElements: (0, _config.getConfig)().computedStyleSupportsPseudoElements
            })
          });
        }
        const labelText = (0, _labelHelpers.getLabels)(document, element).map((label) => label.content).join(" ");
        if (canSuggest("LabelText", method, labelText)) {
          return makeSuggestion("LabelText", element, labelText, {
            variant
          });
        }
        const placeholderText = element.getAttribute("placeholder");
        if (canSuggest("PlaceholderText", method, placeholderText)) {
          return makeSuggestion("PlaceholderText", element, placeholderText, {
            variant
          });
        }
        const textContent = normalize((0, _getNodeText.getNodeText)(element));
        if (canSuggest("Text", method, textContent)) {
          return makeSuggestion("Text", element, textContent, {
            variant
          });
        }
        if (canSuggest("DisplayValue", method, element.value)) {
          return makeSuggestion("DisplayValue", element, normalize(element.value), {
            variant
          });
        }
        const alt = element.getAttribute("alt");
        if (canSuggest("AltText", method, alt)) {
          return makeSuggestion("AltText", element, alt, {
            variant
          });
        }
        const title = element.getAttribute("title");
        if (canSuggest("Title", method, title)) {
          return makeSuggestion("Title", element, title, {
            variant
          });
        }
        const testId = element.getAttribute((0, _config.getConfig)().testIdAttribute);
        if (canSuggest("TestId", method, testId)) {
          return makeSuggestion("TestId", element, testId, {
            variant
          });
        }
        return void 0;
      }
    }
  });

  // node_modules/@testing-library/dom/dist/wait-for.js
  var require_wait_for = __commonJS({
    "node_modules/@testing-library/dom/dist/wait-for.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.waitFor = waitForWrapper;
      var _helpers = require_helpers();
      var _config = require_config();
      function copyStackTrace(target, source) {
        target.stack = source.stack.replace(source.message, target.message);
      }
      function waitFor(callback, {
        container = (0, _helpers.getDocument)(),
        timeout = (0, _config.getConfig)().asyncUtilTimeout,
        showOriginalStackTrace = (0, _config.getConfig)().showOriginalStackTrace,
        stackTraceError,
        interval = 50,
        onTimeout = (error) => {
          Object.defineProperty(error, "message", {
            value: (0, _config.getConfig)().getElementError(error.message, container).message
          });
          return error;
        },
        mutationObserverOptions = {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true
        }
      }) {
        if (typeof callback !== "function") {
          throw new TypeError("Received `callback` arg must be a function");
        }
        return new Promise(async (resolve, reject) => {
          let lastError, intervalId, observer;
          let finished = false;
          let promiseStatus = "idle";
          const overallTimeoutTimer = setTimeout(handleTimeout, timeout);
          const usingJestFakeTimers = (0, _helpers.jestFakeTimersAreEnabled)();
          if (usingJestFakeTimers) {
            const {
              unstable_advanceTimersWrapper: advanceTimersWrapper
            } = (0, _config.getConfig)();
            checkCallback();
            while (!finished) {
              if (!(0, _helpers.jestFakeTimersAreEnabled)()) {
                const error = new Error(`Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`);
                if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError);
                reject(error);
                return;
              }
              await advanceTimersWrapper(async () => {
                jest.advanceTimersByTime(interval);
              });
              if (finished) {
                break;
              }
              checkCallback();
            }
          } else {
            try {
              (0, _helpers.checkContainerType)(container);
            } catch (e) {
              reject(e);
              return;
            }
            intervalId = setInterval(checkRealTimersCallback, interval);
            const {
              MutationObserver
            } = (0, _helpers.getWindowFromNode)(container);
            observer = new MutationObserver(checkRealTimersCallback);
            observer.observe(container, mutationObserverOptions);
            checkCallback();
          }
          function onDone(error, result) {
            finished = true;
            clearTimeout(overallTimeoutTimer);
            if (!usingJestFakeTimers) {
              clearInterval(intervalId);
              observer.disconnect();
            }
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
          function checkRealTimersCallback() {
            if ((0, _helpers.jestFakeTimersAreEnabled)()) {
              const error = new Error(`Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`);
              if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError);
              return reject(error);
            } else {
              return checkCallback();
            }
          }
          function checkCallback() {
            if (promiseStatus === "pending") return;
            try {
              const result = (0, _config.runWithExpensiveErrorDiagnosticsDisabled)(callback);
              if (typeof result?.then === "function") {
                promiseStatus = "pending";
                result.then((resolvedValue) => {
                  promiseStatus = "resolved";
                  onDone(null, resolvedValue);
                }, (rejectedValue) => {
                  promiseStatus = "rejected";
                  lastError = rejectedValue;
                });
              } else {
                onDone(null, result);
              }
            } catch (error) {
              lastError = error;
            }
          }
          function handleTimeout() {
            let error;
            if (lastError) {
              error = lastError;
              if (!showOriginalStackTrace && error.name === "TestingLibraryElementError") {
                copyStackTrace(error, stackTraceError);
              }
            } else {
              error = new Error("Timed out in waitFor.");
              if (!showOriginalStackTrace) {
                copyStackTrace(error, stackTraceError);
              }
            }
            onDone(onTimeout(error), null);
          }
        });
      }
      function waitForWrapper(callback, options) {
        const stackTraceError = new Error("STACK_TRACE_MESSAGE");
        return (0, _config.getConfig)().asyncWrapper(() => waitFor(callback, {
          stackTraceError,
          ...options
        }));
      }
    }
  });

  // node_modules/@testing-library/dom/dist/query-helpers.js
  var require_query_helpers = __commonJS({
    "node_modules/@testing-library/dom/dist/query-helpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.buildQueries = buildQueries;
      exports.getElementError = getElementError;
      exports.getMultipleElementsFoundError = getMultipleElementsFoundError;
      exports.makeFindQuery = makeFindQuery;
      exports.makeGetAllQuery = makeGetAllQuery;
      exports.makeSingleQuery = makeSingleQuery;
      exports.queryAllByAttribute = queryAllByAttribute;
      exports.queryByAttribute = queryByAttribute;
      exports.wrapSingleQueryWithSuggestion = exports.wrapAllByQueryWithSuggestion = void 0;
      var _suggestions = require_suggestions();
      var _matches = require_matches();
      var _waitFor = require_wait_for();
      var _config = require_config();
      function getElementError(message, container) {
        return (0, _config.getConfig)().getElementError(message, container);
      }
      function getMultipleElementsFoundError(message, container) {
        return getElementError(`${message}

(If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).`, container);
      }
      function queryAllByAttribute(attribute, container, text, {
        exact = true,
        collapseWhitespace,
        trim,
        normalizer
      } = {}) {
        const matcher = exact ? _matches.matches : _matches.fuzzyMatches;
        const matchNormalizer = (0, _matches.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        return Array.from(container.querySelectorAll(`[${attribute}]`)).filter((node) => matcher(node.getAttribute(attribute), node, text, matchNormalizer));
      }
      function queryByAttribute(attribute, container, text, options) {
        const els = queryAllByAttribute(attribute, container, text, options);
        if (els.length > 1) {
          throw getMultipleElementsFoundError(`Found multiple elements by [${attribute}=${text}]`, container);
        }
        return els[0] || null;
      }
      function makeSingleQuery(allQuery, getMultipleError) {
        return (container, ...args) => {
          const els = allQuery(container, ...args);
          if (els.length > 1) {
            const elementStrings = els.map((element) => getElementError(null, element).message).join("\n\n");
            throw getMultipleElementsFoundError(`${getMultipleError(container, ...args)}

Here are the matching elements:

${elementStrings}`, container);
          }
          return els[0] || null;
        };
      }
      function getSuggestionError(suggestion, container) {
        return (0, _config.getConfig)().getElementError(`A better query is available, try this:
${suggestion.toString()}
`, container);
      }
      function makeGetAllQuery(allQuery, getMissingError) {
        return (container, ...args) => {
          const els = allQuery(container, ...args);
          if (!els.length) {
            throw (0, _config.getConfig)().getElementError(getMissingError(container, ...args), container);
          }
          return els;
        };
      }
      function makeFindQuery(getter) {
        return (container, text, options, waitForOptions) => {
          return (0, _waitFor.waitFor)(() => {
            return getter(container, text, options);
          }, {
            container,
            ...waitForOptions
          });
        };
      }
      var wrapSingleQueryWithSuggestion = (query, queryAllByName, variant) => (container, ...args) => {
        const element = query(container, ...args);
        const [{
          suggest = (0, _config.getConfig)().throwSuggestions
        } = {}] = args.slice(-1);
        if (element && suggest) {
          const suggestion = (0, _suggestions.getSuggestedQuery)(element, variant);
          if (suggestion && !queryAllByName.endsWith(suggestion.queryName)) {
            throw getSuggestionError(suggestion.toString(), container);
          }
        }
        return element;
      };
      exports.wrapSingleQueryWithSuggestion = wrapSingleQueryWithSuggestion;
      var wrapAllByQueryWithSuggestion = (query, queryAllByName, variant) => (container, ...args) => {
        const els = query(container, ...args);
        const [{
          suggest = (0, _config.getConfig)().throwSuggestions
        } = {}] = args.slice(-1);
        if (els.length && suggest) {
          const uniqueSuggestionMessages = [...new Set(els.map((element) => (0, _suggestions.getSuggestedQuery)(element, variant)?.toString()))];
          if (
            // only want to suggest if all the els have the same suggestion.
            uniqueSuggestionMessages.length === 1 && !queryAllByName.endsWith(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO: Can this be null at runtime?
              (0, _suggestions.getSuggestedQuery)(els[0], variant).queryName
            )
          ) {
            throw getSuggestionError(uniqueSuggestionMessages[0], container);
          }
        }
        return els;
      };
      exports.wrapAllByQueryWithSuggestion = wrapAllByQueryWithSuggestion;
      function buildQueries(queryAllBy, getMultipleError, getMissingError) {
        const queryBy = wrapSingleQueryWithSuggestion(makeSingleQuery(queryAllBy, getMultipleError), queryAllBy.name, "query");
        const getAllBy = makeGetAllQuery(queryAllBy, getMissingError);
        const getBy = makeSingleQuery(getAllBy, getMultipleError);
        const getByWithSuggestions = wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, "get");
        const getAllWithSuggestions = wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name.replace("query", "get"), "getAll");
        const findAllBy = makeFindQuery(wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name, "findAll"));
        const findBy = makeFindQuery(wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, "find"));
        return [queryBy, getAllWithSuggestions, getByWithSuggestions, findAllBy, findBy];
      }
    }
  });

  // node_modules/@testing-library/dom/dist/queries/all-utils.js
  var require_all_utils = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/all-utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _matches = require_matches();
      Object.keys(_matches).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _matches[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _matches[key];
          }
        });
      });
      var _getNodeText = require_get_node_text();
      Object.keys(_getNodeText).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _getNodeText[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _getNodeText[key];
          }
        });
      });
      var _queryHelpers = require_query_helpers();
      Object.keys(_queryHelpers).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _queryHelpers[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _queryHelpers[key];
          }
        });
      });
      var _config = require_config();
      Object.keys(_config).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _config[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _config[key];
          }
        });
      });
    }
  });

  // node_modules/@testing-library/dom/dist/queries/label-text.js
  var require_label_text = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/label-text.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByLabelText = exports.queryAllByLabelText = exports.getByLabelText = exports.getAllByLabelText = exports.findByLabelText = exports.findAllByLabelText = void 0;
      var _config = require_config();
      var _helpers = require_helpers();
      var _labelHelpers = require_label_helpers();
      var _allUtils = require_all_utils();
      function queryAllLabels(container) {
        return Array.from(container.querySelectorAll("label,input")).map((node) => {
          return {
            node,
            textToMatch: (0, _labelHelpers.getLabelContent)(node)
          };
        }).filter(({
          textToMatch
        }) => textToMatch !== null);
      }
      var queryAllLabelsByText = (container, text, {
        exact = true,
        trim,
        collapseWhitespace,
        normalizer
      } = {}) => {
        const matcher = exact ? _allUtils.matches : _allUtils.fuzzyMatches;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        const textToMatchByLabels = queryAllLabels(container);
        return textToMatchByLabels.filter(({
          node,
          textToMatch
        }) => matcher(textToMatch, node, text, matchNormalizer)).map(({
          node
        }) => node);
      };
      var queryAllByLabelText = (container, text, {
        selector = "*",
        exact = true,
        collapseWhitespace,
        trim,
        normalizer
      } = {}) => {
        (0, _helpers.checkContainerType)(container);
        const matcher = exact ? _allUtils.matches : _allUtils.fuzzyMatches;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        const matchingLabelledElements = Array.from(container.querySelectorAll("*")).filter((element) => {
          return (0, _labelHelpers.getRealLabels)(element).length || element.hasAttribute("aria-labelledby");
        }).reduce((labelledElements, labelledElement) => {
          const labelList = (0, _labelHelpers.getLabels)(container, labelledElement, {
            selector
          });
          labelList.filter((label) => Boolean(label.formControl)).forEach((label) => {
            if (matcher(label.content, label.formControl, text, matchNormalizer) && label.formControl) {
              labelledElements.push(label.formControl);
            }
          });
          const labelsValue = labelList.filter((label) => Boolean(label.content)).map((label) => label.content);
          if (matcher(labelsValue.join(" "), labelledElement, text, matchNormalizer)) {
            labelledElements.push(labelledElement);
          }
          if (labelsValue.length > 1) {
            labelsValue.forEach((labelValue, index) => {
              if (matcher(labelValue, labelledElement, text, matchNormalizer)) {
                labelledElements.push(labelledElement);
              }
              const labelsFiltered = [...labelsValue];
              labelsFiltered.splice(index, 1);
              if (labelsFiltered.length > 1) {
                if (matcher(labelsFiltered.join(" "), labelledElement, text, matchNormalizer)) {
                  labelledElements.push(labelledElement);
                }
              }
            });
          }
          return labelledElements;
        }, []).concat((0, _allUtils.queryAllByAttribute)("aria-label", container, text, {
          exact,
          normalizer: matchNormalizer
        }));
        return Array.from(new Set(matchingLabelledElements)).filter((element) => element.matches(selector));
      };
      var getAllByLabelText = (container, text, ...rest) => {
        const els = queryAllByLabelText(container, text, ...rest);
        if (!els.length) {
          const labels = queryAllLabelsByText(container, text, ...rest);
          if (labels.length) {
            const tagNames = labels.map((label) => getTagNameOfElementAssociatedWithLabelViaFor(container, label)).filter((tagName) => !!tagName);
            if (tagNames.length) {
              throw (0, _config.getConfig)().getElementError(tagNames.map((tagName) => `Found a label with the text of: ${text}, however the element associated with this label (<${tagName} />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <${tagName} />, you can use aria-label or aria-labelledby instead.`).join("\n\n"), container);
            } else {
              throw (0, _config.getConfig)().getElementError(`Found a label with the text of: ${text}, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.`, container);
            }
          } else {
            throw (0, _config.getConfig)().getElementError(`Unable to find a label with the text of: ${text}`, container);
          }
        }
        return els;
      };
      function getTagNameOfElementAssociatedWithLabelViaFor(container, label) {
        const htmlFor = label.getAttribute("for");
        if (!htmlFor) {
          return null;
        }
        const element = container.querySelector(`[id="${htmlFor}"]`);
        return element ? element.tagName.toLowerCase() : null;
      }
      var getMultipleError = (c, text) => `Found multiple elements with the text of: ${text}`;
      var queryByLabelText = exports.queryByLabelText = (0, _allUtils.wrapSingleQueryWithSuggestion)((0, _allUtils.makeSingleQuery)(queryAllByLabelText, getMultipleError), queryAllByLabelText.name, "query");
      var getByLabelText = (0, _allUtils.makeSingleQuery)(getAllByLabelText, getMultipleError);
      var findAllByLabelText = exports.findAllByLabelText = (0, _allUtils.makeFindQuery)((0, _allUtils.wrapAllByQueryWithSuggestion)(getAllByLabelText, getAllByLabelText.name, "findAll"));
      var findByLabelText = exports.findByLabelText = (0, _allUtils.makeFindQuery)((0, _allUtils.wrapSingleQueryWithSuggestion)(getByLabelText, getAllByLabelText.name, "find"));
      var getAllByLabelTextWithSuggestions = exports.getAllByLabelText = (0, _allUtils.wrapAllByQueryWithSuggestion)(getAllByLabelText, getAllByLabelText.name, "getAll");
      var getByLabelTextWithSuggestions = exports.getByLabelText = (0, _allUtils.wrapSingleQueryWithSuggestion)(getByLabelText, getAllByLabelText.name, "get");
      var queryAllByLabelTextWithSuggestions = exports.queryAllByLabelText = (0, _allUtils.wrapAllByQueryWithSuggestion)(queryAllByLabelText, queryAllByLabelText.name, "queryAll");
    }
  });

  // node_modules/@testing-library/dom/dist/queries/placeholder-text.js
  var require_placeholder_text = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/placeholder-text.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByPlaceholderText = exports.queryAllByPlaceholderText = exports.getByPlaceholderText = exports.getAllByPlaceholderText = exports.findByPlaceholderText = exports.findAllByPlaceholderText = void 0;
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var queryAllByPlaceholderText = (...args) => {
        (0, _helpers.checkContainerType)(args[0]);
        return (0, _allUtils.queryAllByAttribute)("placeholder", ...args);
      };
      var getMultipleError = (c, text) => `Found multiple elements with the placeholder text of: ${text}`;
      var getMissingError = (c, text) => `Unable to find an element with the placeholder text of: ${text}`;
      var queryAllByPlaceholderTextWithSuggestions = exports.queryAllByPlaceholderText = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByPlaceholderText, queryAllByPlaceholderText.name, "queryAll");
      var [queryByPlaceholderText, getAllByPlaceholderText, getByPlaceholderText, findAllByPlaceholderText, findByPlaceholderText] = (0, _allUtils.buildQueries)(queryAllByPlaceholderText, getMultipleError, getMissingError);
      exports.findByPlaceholderText = findByPlaceholderText;
      exports.findAllByPlaceholderText = findAllByPlaceholderText;
      exports.getByPlaceholderText = getByPlaceholderText;
      exports.getAllByPlaceholderText = getAllByPlaceholderText;
      exports.queryByPlaceholderText = queryByPlaceholderText;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/text.js
  var require_text = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/text.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByText = exports.queryAllByText = exports.getByText = exports.getAllByText = exports.findByText = exports.findAllByText = void 0;
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var queryAllByText = (container, text, {
        selector = "*",
        exact = true,
        collapseWhitespace,
        trim,
        ignore = (0, _allUtils.getConfig)().defaultIgnore,
        normalizer
      } = {}) => {
        (0, _helpers.checkContainerType)(container);
        const matcher = exact ? _allUtils.matches : _allUtils.fuzzyMatches;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        let baseArray = [];
        if (typeof container.matches === "function" && container.matches(selector)) {
          baseArray = [container];
        }
        return [...baseArray, ...Array.from(container.querySelectorAll(selector))].filter((node) => !ignore || !node.matches(ignore)).filter((node) => matcher((0, _allUtils.getNodeText)(node), node, text, matchNormalizer));
      };
      var getMultipleError = (c, text) => `Found multiple elements with the text: ${text}`;
      var getMissingError = (c, text, options = {}) => {
        const {
          collapseWhitespace,
          trim,
          normalizer,
          selector
        } = options;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        const normalizedText = matchNormalizer(text.toString());
        const isNormalizedDifferent = normalizedText !== text.toString();
        const isCustomSelector = (selector ?? "*") !== "*";
        return `Unable to find an element with the text: ${isNormalizedDifferent ? `${normalizedText} (normalized from '${text}')` : text}${isCustomSelector ? `, which matches selector '${selector}'` : ""}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`;
      };
      var queryAllByTextWithSuggestions = exports.queryAllByText = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByText, queryAllByText.name, "queryAll");
      var [queryByText, getAllByText, getByText, findAllByText, findByText] = (0, _allUtils.buildQueries)(queryAllByText, getMultipleError, getMissingError);
      exports.findByText = findByText;
      exports.findAllByText = findAllByText;
      exports.getByText = getByText;
      exports.getAllByText = getAllByText;
      exports.queryByText = queryByText;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/display-value.js
  var require_display_value = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/display-value.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByDisplayValue = exports.queryAllByDisplayValue = exports.getByDisplayValue = exports.getAllByDisplayValue = exports.findByDisplayValue = exports.findAllByDisplayValue = void 0;
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var queryAllByDisplayValue = (container, value, {
        exact = true,
        collapseWhitespace,
        trim,
        normalizer
      } = {}) => {
        (0, _helpers.checkContainerType)(container);
        const matcher = exact ? _allUtils.matches : _allUtils.fuzzyMatches;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        return Array.from(container.querySelectorAll(`input,textarea,select`)).filter((node) => {
          if (node.tagName === "SELECT") {
            const selectedOptions = Array.from(node.options).filter((option) => option.selected);
            return selectedOptions.some((optionNode) => matcher((0, _allUtils.getNodeText)(optionNode), optionNode, value, matchNormalizer));
          } else {
            return matcher(node.value, node, value, matchNormalizer);
          }
        });
      };
      var getMultipleError = (c, value) => `Found multiple elements with the display value: ${value}.`;
      var getMissingError = (c, value) => `Unable to find an element with the display value: ${value}.`;
      var queryAllByDisplayValueWithSuggestions = exports.queryAllByDisplayValue = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByDisplayValue, queryAllByDisplayValue.name, "queryAll");
      var [queryByDisplayValue, getAllByDisplayValue, getByDisplayValue, findAllByDisplayValue, findByDisplayValue] = (0, _allUtils.buildQueries)(queryAllByDisplayValue, getMultipleError, getMissingError);
      exports.findByDisplayValue = findByDisplayValue;
      exports.findAllByDisplayValue = findAllByDisplayValue;
      exports.getByDisplayValue = getByDisplayValue;
      exports.getAllByDisplayValue = getAllByDisplayValue;
      exports.queryByDisplayValue = queryByDisplayValue;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/alt-text.js
  var require_alt_text = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/alt-text.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByAltText = exports.queryAllByAltText = exports.getByAltText = exports.getAllByAltText = exports.findByAltText = exports.findAllByAltText = void 0;
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var VALID_TAG_REGEXP = /^(img|input|area|.+-.+)$/i;
      var queryAllByAltText = (container, alt, options = {}) => {
        (0, _helpers.checkContainerType)(container);
        return (0, _queryHelpers.queryAllByAttribute)("alt", container, alt, options).filter((node) => VALID_TAG_REGEXP.test(node.tagName));
      };
      var getMultipleError = (c, alt) => `Found multiple elements with the alt text: ${alt}`;
      var getMissingError = (c, alt) => `Unable to find an element with the alt text: ${alt}`;
      var queryAllByAltTextWithSuggestions = exports.queryAllByAltText = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByAltText, queryAllByAltText.name, "queryAll");
      var [queryByAltText, getAllByAltText, getByAltText, findAllByAltText, findByAltText] = (0, _allUtils.buildQueries)(queryAllByAltText, getMultipleError, getMissingError);
      exports.findByAltText = findByAltText;
      exports.findAllByAltText = findAllByAltText;
      exports.getByAltText = getByAltText;
      exports.getAllByAltText = getAllByAltText;
      exports.queryByAltText = queryByAltText;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/title.js
  var require_title = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/title.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByTitle = exports.queryAllByTitle = exports.getByTitle = exports.getAllByTitle = exports.findByTitle = exports.findAllByTitle = void 0;
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var isSvgTitle = (node) => node.tagName.toLowerCase() === "title" && node.parentElement?.tagName.toLowerCase() === "svg";
      var queryAllByTitle = (container, text, {
        exact = true,
        collapseWhitespace,
        trim,
        normalizer
      } = {}) => {
        (0, _helpers.checkContainerType)(container);
        const matcher = exact ? _allUtils.matches : _allUtils.fuzzyMatches;
        const matchNormalizer = (0, _allUtils.makeNormalizer)({
          collapseWhitespace,
          trim,
          normalizer
        });
        return Array.from(container.querySelectorAll("[title], svg > title")).filter((node) => matcher(node.getAttribute("title"), node, text, matchNormalizer) || isSvgTitle(node) && matcher((0, _allUtils.getNodeText)(node), node, text, matchNormalizer));
      };
      var getMultipleError = (c, title) => `Found multiple elements with the title: ${title}.`;
      var getMissingError = (c, title) => `Unable to find an element with the title: ${title}.`;
      var queryAllByTitleWithSuggestions = exports.queryAllByTitle = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByTitle, queryAllByTitle.name, "queryAll");
      var [queryByTitle, getAllByTitle, getByTitle, findAllByTitle, findByTitle] = (0, _allUtils.buildQueries)(queryAllByTitle, getMultipleError, getMissingError);
      exports.findByTitle = findByTitle;
      exports.findAllByTitle = findAllByTitle;
      exports.getByTitle = getByTitle;
      exports.getAllByTitle = getAllByTitle;
      exports.queryByTitle = queryByTitle;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/role.js
  var require_role = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/role.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByRole = exports.queryAllByRole = exports.getByRole = exports.getAllByRole = exports.findByRole = exports.findAllByRole = void 0;
      var _domAccessibilityApi = require_dist();
      var _ariaQuery = require_lib();
      var _roleHelpers = require_role_helpers();
      var _queryHelpers = require_query_helpers();
      var _helpers = require_helpers();
      var _allUtils = require_all_utils();
      var queryAllByRole = (container, role, {
        hidden = (0, _allUtils.getConfig)().defaultHidden,
        name,
        description,
        queryFallbacks = false,
        selected,
        busy,
        checked,
        pressed,
        current,
        level,
        expanded,
        value: {
          now: valueNow,
          min: valueMin,
          max: valueMax,
          text: valueText
        } = {}
      } = {}) => {
        (0, _helpers.checkContainerType)(container);
        if (selected !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-selected"] === void 0) {
            throw new Error(`"aria-selected" is not supported on role "${role}".`);
          }
        }
        if (busy !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-busy"] === void 0) {
            throw new Error(`"aria-busy" is not supported on role "${role}".`);
          }
        }
        if (checked !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-checked"] === void 0) {
            throw new Error(`"aria-checked" is not supported on role "${role}".`);
          }
        }
        if (pressed !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-pressed"] === void 0) {
            throw new Error(`"aria-pressed" is not supported on role "${role}".`);
          }
        }
        if (current !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-current"] === void 0) {
            throw new Error(`"aria-current" is not supported on role "${role}".`);
          }
        }
        if (level !== void 0) {
          if (role !== "heading") {
            throw new Error(`Role "${role}" cannot have "level" property.`);
          }
        }
        if (valueNow !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-valuenow"] === void 0) {
            throw new Error(`"aria-valuenow" is not supported on role "${role}".`);
          }
        }
        if (valueMax !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-valuemax"] === void 0) {
            throw new Error(`"aria-valuemax" is not supported on role "${role}".`);
          }
        }
        if (valueMin !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-valuemin"] === void 0) {
            throw new Error(`"aria-valuemin" is not supported on role "${role}".`);
          }
        }
        if (valueText !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-valuetext"] === void 0) {
            throw new Error(`"aria-valuetext" is not supported on role "${role}".`);
          }
        }
        if (expanded !== void 0) {
          if (_ariaQuery.roles.get(role)?.props["aria-expanded"] === void 0) {
            throw new Error(`"aria-expanded" is not supported on role "${role}".`);
          }
        }
        const subtreeIsInaccessibleCache = /* @__PURE__ */ new WeakMap();
        function cachedIsSubtreeInaccessible(element) {
          if (!subtreeIsInaccessibleCache.has(element)) {
            subtreeIsInaccessibleCache.set(element, (0, _roleHelpers.isSubtreeInaccessible)(element));
          }
          return subtreeIsInaccessibleCache.get(element);
        }
        return Array.from(container.querySelectorAll(
          // Only query elements that can be matched by the following filters
          makeRoleSelector(role)
        )).filter((node) => {
          const isRoleSpecifiedExplicitly = node.hasAttribute("role");
          if (isRoleSpecifiedExplicitly) {
            const roleValue = node.getAttribute("role");
            if (queryFallbacks) {
              return roleValue.split(" ").filter(Boolean).some((roleAttributeToken) => roleAttributeToken === role);
            }
            const [firstRoleAttributeToken] = roleValue.split(" ");
            return firstRoleAttributeToken === role;
          }
          const implicitRoles = (0, _roleHelpers.getImplicitAriaRoles)(node);
          return implicitRoles.some((implicitRole) => {
            return implicitRole === role;
          });
        }).filter((element) => {
          if (selected !== void 0) {
            return selected === (0, _roleHelpers.computeAriaSelected)(element);
          }
          if (busy !== void 0) {
            return busy === (0, _roleHelpers.computeAriaBusy)(element);
          }
          if (checked !== void 0) {
            return checked === (0, _roleHelpers.computeAriaChecked)(element);
          }
          if (pressed !== void 0) {
            return pressed === (0, _roleHelpers.computeAriaPressed)(element);
          }
          if (current !== void 0) {
            return current === (0, _roleHelpers.computeAriaCurrent)(element);
          }
          if (expanded !== void 0) {
            return expanded === (0, _roleHelpers.computeAriaExpanded)(element);
          }
          if (level !== void 0) {
            return level === (0, _roleHelpers.computeHeadingLevel)(element);
          }
          if (valueNow !== void 0 || valueMax !== void 0 || valueMin !== void 0 || valueText !== void 0) {
            let valueMatches = true;
            if (valueNow !== void 0) {
              valueMatches &&= valueNow === (0, _roleHelpers.computeAriaValueNow)(element);
            }
            if (valueMax !== void 0) {
              valueMatches &&= valueMax === (0, _roleHelpers.computeAriaValueMax)(element);
            }
            if (valueMin !== void 0) {
              valueMatches &&= valueMin === (0, _roleHelpers.computeAriaValueMin)(element);
            }
            if (valueText !== void 0) {
              valueMatches &&= (0, _allUtils.matches)((0, _roleHelpers.computeAriaValueText)(element) ?? null, element, valueText, (text) => text);
            }
            return valueMatches;
          }
          return true;
        }).filter((element) => {
          if (name === void 0) {
            return true;
          }
          return (0, _allUtils.matches)((0, _domAccessibilityApi.computeAccessibleName)(element, {
            computedStyleSupportsPseudoElements: (0, _allUtils.getConfig)().computedStyleSupportsPseudoElements
          }), element, name, (text) => text);
        }).filter((element) => {
          if (description === void 0) {
            return true;
          }
          return (0, _allUtils.matches)((0, _domAccessibilityApi.computeAccessibleDescription)(element, {
            computedStyleSupportsPseudoElements: (0, _allUtils.getConfig)().computedStyleSupportsPseudoElements
          }), element, description, (text) => text);
        }).filter((element) => {
          return hidden === false ? (0, _roleHelpers.isInaccessible)(element, {
            isSubtreeInaccessible: cachedIsSubtreeInaccessible
          }) === false : true;
        });
      };
      function makeRoleSelector(role) {
        const explicitRoleSelector = `*[role~="${role}"]`;
        const roleRelations = _ariaQuery.roleElements.get(role) ?? /* @__PURE__ */ new Set();
        const implicitRoleSelectors = new Set(Array.from(roleRelations).map(({
          name
        }) => name));
        return [explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(",");
      }
      var getNameHint = (name) => {
        let nameHint = "";
        if (name === void 0) {
          nameHint = "";
        } else if (typeof name === "string") {
          nameHint = ` and name "${name}"`;
        } else {
          nameHint = ` and name \`${name}\``;
        }
        return nameHint;
      };
      var getMultipleError = (c, role, {
        name
      } = {}) => {
        return `Found multiple elements with the role "${role}"${getNameHint(name)}`;
      };
      var getMissingError = (container, role, {
        hidden = (0, _allUtils.getConfig)().defaultHidden,
        name,
        description
      } = {}) => {
        if ((0, _allUtils.getConfig)()._disableExpensiveErrorDiagnostics) {
          return `Unable to find role="${role}"${getNameHint(name)}`;
        }
        let roles = "";
        Array.from(container.children).forEach((childElement) => {
          roles += (0, _roleHelpers.prettyRoles)(childElement, {
            hidden,
            includeDescription: description !== void 0
          });
        });
        let roleMessage;
        if (roles.length === 0) {
          if (hidden === false) {
            roleMessage = "There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the `hidden` option to `true`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole";
          } else {
            roleMessage = "There are no available roles.";
          }
        } else {
          roleMessage = `
Here are the ${hidden === false ? "accessible" : "available"} roles:

  ${roles.replace(/\n/g, "\n  ").replace(/\n\s\s\n/g, "\n\n")}
`.trim();
        }
        let nameHint = "";
        if (name === void 0) {
          nameHint = "";
        } else if (typeof name === "string") {
          nameHint = ` and name "${name}"`;
        } else {
          nameHint = ` and name \`${name}\``;
        }
        let descriptionHint = "";
        if (description === void 0) {
          descriptionHint = "";
        } else if (typeof description === "string") {
          descriptionHint = ` and description "${description}"`;
        } else {
          descriptionHint = ` and description \`${description}\``;
        }
        return `
Unable to find an ${hidden === false ? "accessible " : ""}element with the role "${role}"${nameHint}${descriptionHint}

${roleMessage}`.trim();
      };
      var queryAllByRoleWithSuggestions = exports.queryAllByRole = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByRole, queryAllByRole.name, "queryAll");
      var [queryByRole, getAllByRole, getByRole, findAllByRole, findByRole] = (0, _allUtils.buildQueries)(queryAllByRole, getMultipleError, getMissingError);
      exports.findByRole = findByRole;
      exports.findAllByRole = findAllByRole;
      exports.getByRole = getByRole;
      exports.getAllByRole = getAllByRole;
      exports.queryByRole = queryByRole;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/test-id.js
  var require_test_id = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/test-id.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.queryByTestId = exports.queryAllByTestId = exports.getByTestId = exports.getAllByTestId = exports.findByTestId = exports.findAllByTestId = void 0;
      var _helpers = require_helpers();
      var _queryHelpers = require_query_helpers();
      var _allUtils = require_all_utils();
      var getTestIdAttribute = () => (0, _allUtils.getConfig)().testIdAttribute;
      var queryAllByTestId = (...args) => {
        (0, _helpers.checkContainerType)(args[0]);
        return (0, _allUtils.queryAllByAttribute)(getTestIdAttribute(), ...args);
      };
      var getMultipleError = (c, id) => `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`;
      var getMissingError = (c, id) => `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`;
      var queryAllByTestIdWithSuggestions = exports.queryAllByTestId = (0, _queryHelpers.wrapAllByQueryWithSuggestion)(queryAllByTestId, queryAllByTestId.name, "queryAll");
      var [queryByTestId, getAllByTestId, getByTestId, findAllByTestId, findByTestId] = (0, _allUtils.buildQueries)(queryAllByTestId, getMultipleError, getMissingError);
      exports.findByTestId = findByTestId;
      exports.findAllByTestId = findAllByTestId;
      exports.getByTestId = getByTestId;
      exports.getAllByTestId = getAllByTestId;
      exports.queryByTestId = queryByTestId;
    }
  });

  // node_modules/@testing-library/dom/dist/queries/index.js
  var require_queries = __commonJS({
    "node_modules/@testing-library/dom/dist/queries/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _labelText = require_label_text();
      Object.keys(_labelText).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _labelText[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _labelText[key];
          }
        });
      });
      var _placeholderText = require_placeholder_text();
      Object.keys(_placeholderText).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _placeholderText[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _placeholderText[key];
          }
        });
      });
      var _text = require_text();
      Object.keys(_text).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _text[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _text[key];
          }
        });
      });
      var _displayValue = require_display_value();
      Object.keys(_displayValue).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _displayValue[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _displayValue[key];
          }
        });
      });
      var _altText = require_alt_text();
      Object.keys(_altText).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _altText[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _altText[key];
          }
        });
      });
      var _title = require_title();
      Object.keys(_title).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _title[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _title[key];
          }
        });
      });
      var _role = require_role();
      Object.keys(_role).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _role[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _role[key];
          }
        });
      });
      var _testId = require_test_id();
      Object.keys(_testId).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _testId[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _testId[key];
          }
        });
      });
    }
  });

  // node_modules/@testing-library/dom/dist/get-queries-for-element.js
  var require_get_queries_for_element = __commonJS({
    "node_modules/@testing-library/dom/dist/get-queries-for-element.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.getQueriesForElement = getQueriesForElement;
      var defaultQueries = _interopRequireWildcard(require_queries());
      function _interopRequireWildcard(e, t) {
        if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (_interopRequireWildcard = function(e2, t2) {
          if (!t2 && e2 && e2.__esModule) return e2;
          var o, i, f = { __proto__: null, default: e2 };
          if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
          if (o = t2 ? n : r) {
            if (o.has(e2)) return o.get(e2);
            o.set(e2, f);
          }
          for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
          return f;
        })(e, t);
      }
      function getQueriesForElement(element, queries = defaultQueries, initialValue = {}) {
        return Object.keys(queries).reduce((helpers, key) => {
          const fn = queries[key];
          helpers[key] = fn.bind(null, element);
          return helpers;
        }, initialValue);
      }
    }
  });

  // node_modules/@testing-library/dom/dist/wait-for-element-to-be-removed.js
  var require_wait_for_element_to_be_removed = __commonJS({
    "node_modules/@testing-library/dom/dist/wait-for-element-to-be-removed.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.waitForElementToBeRemoved = waitForElementToBeRemoved;
      var _waitFor = require_wait_for();
      var isRemoved = (result) => !result || Array.isArray(result) && !result.length;
      function initialCheck(elements) {
        if (isRemoved(elements)) {
          throw new Error("The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.");
        }
      }
      async function waitForElementToBeRemoved(callback, options) {
        const timeoutError = new Error("Timed out in waitForElementToBeRemoved.");
        if (typeof callback !== "function") {
          initialCheck(callback);
          const elements = Array.isArray(callback) ? callback : [callback];
          const getRemainingElements = elements.map((element) => {
            let parent = element.parentElement;
            if (parent === null) return () => null;
            while (parent.parentElement) parent = parent.parentElement;
            return () => parent.contains(element) ? element : null;
          });
          callback = () => getRemainingElements.map((c) => c()).filter(Boolean);
        }
        initialCheck(callback());
        return (0, _waitFor.waitFor)(() => {
          let result;
          try {
            result = callback();
          } catch (error) {
            if (error.name === "TestingLibraryElementError") {
              return void 0;
            }
            throw error;
          }
          if (!isRemoved(result)) {
            throw timeoutError;
          }
          return void 0;
        }, options);
      }
    }
  });

  // node_modules/@testing-library/dom/dist/event-map.js
  var require_event_map = __commonJS({
    "node_modules/@testing-library/dom/dist/event-map.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.eventMap = exports.eventAliasMap = void 0;
      var eventMap = exports.eventMap = {
        // Clipboard Events
        copy: {
          EventType: "ClipboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        cut: {
          EventType: "ClipboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        paste: {
          EventType: "ClipboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        // Composition Events
        compositionEnd: {
          EventType: "CompositionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        compositionStart: {
          EventType: "CompositionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        compositionUpdate: {
          EventType: "CompositionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        // Keyboard Events
        keyDown: {
          EventType: "KeyboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            charCode: 0,
            composed: true
          }
        },
        keyPress: {
          EventType: "KeyboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            charCode: 0,
            composed: true
          }
        },
        keyUp: {
          EventType: "KeyboardEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            charCode: 0,
            composed: true
          }
        },
        // Focus Events
        focus: {
          EventType: "FocusEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false,
            composed: true
          }
        },
        blur: {
          EventType: "FocusEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false,
            composed: true
          }
        },
        focusIn: {
          EventType: "FocusEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        focusOut: {
          EventType: "FocusEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        // Form Events
        change: {
          EventType: "Event",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        input: {
          EventType: "InputEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        invalid: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: true
          }
        },
        submit: {
          EventType: "Event",
          defaultInit: {
            bubbles: true,
            cancelable: true
          }
        },
        reset: {
          EventType: "Event",
          defaultInit: {
            bubbles: true,
            cancelable: true
          }
        },
        // Mouse Events
        click: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            button: 0,
            composed: true
          }
        },
        contextMenu: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        dblClick: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        drag: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        dragEnd: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        dragEnter: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        dragExit: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        dragLeave: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        dragOver: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        dragStart: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        drop: {
          EventType: "DragEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        mouseDown: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        mouseEnter: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false,
            composed: true
          }
        },
        mouseLeave: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false,
            composed: true
          }
        },
        mouseMove: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        mouseOut: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        mouseOver: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        mouseUp: {
          EventType: "MouseEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        // Selection Events
        select: {
          EventType: "Event",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        // Touch Events
        touchCancel: {
          EventType: "TouchEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        touchEnd: {
          EventType: "TouchEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        touchMove: {
          EventType: "TouchEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        touchStart: {
          EventType: "TouchEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        // UI Events
        resize: {
          EventType: "UIEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        scroll: {
          EventType: "UIEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        // Wheel Events
        wheel: {
          EventType: "WheelEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        // Media Events
        abort: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        canPlay: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        canPlayThrough: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        durationChange: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        emptied: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        encrypted: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        ended: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        loadedData: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        loadedMetadata: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        loadStart: {
          EventType: "ProgressEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        pause: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        play: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        playing: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        progress: {
          EventType: "ProgressEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        rateChange: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        seeked: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        seeking: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        stalled: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        suspend: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        timeUpdate: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        volumeChange: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        waiting: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        // Events
        load: {
          // TODO: load events can be UIEvent or Event depending on what generated them
          // This is where this abstraction breaks down.
          // But the common targets are <img />, <script /> and window.
          // Neither of these targets receive a UIEvent
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        error: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        // Animation Events
        animationStart: {
          EventType: "AnimationEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        animationEnd: {
          EventType: "AnimationEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        animationIteration: {
          EventType: "AnimationEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        // Transition Events
        transitionCancel: {
          EventType: "TransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        transitionEnd: {
          EventType: "TransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true
          }
        },
        transitionRun: {
          EventType: "TransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        transitionStart: {
          EventType: "TransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        // pointer events
        pointerOver: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        pointerEnter: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        pointerDown: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        pointerMove: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        pointerUp: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        pointerCancel: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        pointerOut: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true,
            composed: true
          }
        },
        pointerLeave: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        gotPointerCapture: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        lostPointerCapture: {
          EventType: "PointerEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false,
            composed: true
          }
        },
        // history events
        popState: {
          EventType: "PopStateEvent",
          defaultInit: {
            bubbles: true,
            cancelable: false
          }
        },
        // window events
        offline: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        online: {
          EventType: "Event",
          defaultInit: {
            bubbles: false,
            cancelable: false
          }
        },
        pageHide: {
          EventType: "PageTransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true
          }
        },
        pageShow: {
          EventType: "PageTransitionEvent",
          defaultInit: {
            bubbles: true,
            cancelable: true
          }
        }
      };
      var eventAliasMap = exports.eventAliasMap = {
        doubleClick: "dblClick"
      };
    }
  });

  // node_modules/@testing-library/dom/dist/events.js
  var require_events = __commonJS({
    "node_modules/@testing-library/dom/dist/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.createEvent = createEvent;
      exports.fireEvent = fireEvent;
      var _config = require_config();
      var _helpers = require_helpers();
      var _eventMap = require_event_map();
      function fireEvent(element, event) {
        return (0, _config.getConfig)().eventWrapper(() => {
          if (!event) {
            throw new Error(`Unable to fire an event - please provide an event object.`);
          }
          if (!element) {
            throw new Error(`Unable to fire a "${event.type}" event - please provide a DOM element.`);
          }
          return element.dispatchEvent(event);
        });
      }
      function createEvent(eventName, node, init, {
        EventType = "Event",
        defaultInit = {}
      } = {}) {
        if (!node) {
          throw new Error(`Unable to fire a "${eventName}" event - please provide a DOM element.`);
        }
        const eventInit = {
          ...defaultInit,
          ...init
        };
        const {
          target: {
            value,
            files,
            ...targetProperties
          } = {}
        } = eventInit;
        if (value !== void 0) {
          setNativeValue(node, value);
        }
        if (files !== void 0) {
          Object.defineProperty(node, "files", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: files
          });
        }
        Object.assign(node, targetProperties);
        const window2 = (0, _helpers.getWindowFromNode)(node);
        const EventConstructor = window2[EventType] || window2.Event;
        let event;
        if (typeof EventConstructor === "function") {
          event = new EventConstructor(eventName, eventInit);
        } else {
          event = window2.document.createEvent(EventType);
          const {
            bubbles,
            cancelable,
            detail,
            ...otherInit
          } = eventInit;
          event.initEvent(eventName, bubbles, cancelable, detail);
          Object.keys(otherInit).forEach((eventKey) => {
            event[eventKey] = otherInit[eventKey];
          });
        }
        const dataTransferProperties = ["dataTransfer", "clipboardData"];
        dataTransferProperties.forEach((dataTransferKey) => {
          const dataTransferValue = eventInit[dataTransferKey];
          if (typeof dataTransferValue === "object") {
            if (typeof window2.DataTransfer === "function") {
              Object.defineProperty(event, dataTransferKey, {
                value: Object.getOwnPropertyNames(dataTransferValue).reduce((acc, propName) => {
                  Object.defineProperty(acc, propName, {
                    value: dataTransferValue[propName]
                  });
                  return acc;
                }, new window2.DataTransfer())
              });
            } else {
              Object.defineProperty(event, dataTransferKey, {
                value: dataTransferValue
              });
            }
          }
        });
        return event;
      }
      Object.keys(_eventMap.eventMap).forEach((key) => {
        const {
          EventType,
          defaultInit
        } = _eventMap.eventMap[key];
        const eventName = key.toLowerCase();
        createEvent[key] = (node, init) => createEvent(eventName, node, init, {
          EventType,
          defaultInit
        });
        fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init));
      });
      function setNativeValue(element, value) {
        const {
          set: valueSetter
        } = Object.getOwnPropertyDescriptor(element, "value") || {};
        const prototype = Object.getPrototypeOf(element);
        const {
          set: prototypeValueSetter
        } = Object.getOwnPropertyDescriptor(prototype, "value") || {};
        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
          prototypeValueSetter.call(element, value);
        } else {
          if (valueSetter) {
            valueSetter.call(element, value);
          } else {
            throw new Error("The given element does not have a value setter");
          }
        }
      }
      Object.keys(_eventMap.eventAliasMap).forEach((aliasKey) => {
        const key = _eventMap.eventAliasMap[aliasKey];
        fireEvent[aliasKey] = (...args) => fireEvent[key](...args);
      });
    }
  });

  // node_modules/lz-string/libs/lz-string.js
  var require_lz_string = __commonJS({
    "node_modules/lz-string/libs/lz-string.js"(exports, module) {
      var LZString = (function() {
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        var baseReverseDic = {};
        function getBaseValue(alphabet, character) {
          if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
              baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
          }
          return baseReverseDic[alphabet][character];
        }
        var LZString2 = {
          compressToBase64: function(input) {
            if (input == null) return "";
            var res = LZString2._compress(input, 6, function(a) {
              return keyStrBase64.charAt(a);
            });
            switch (res.length % 4) {
              // To produce valid Base64
              default:
              // When could this happen ?
              case 0:
                return res;
              case 1:
                return res + "===";
              case 2:
                return res + "==";
              case 3:
                return res + "=";
            }
          },
          decompressFromBase64: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            return LZString2._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrBase64, input.charAt(index));
            });
          },
          compressToUTF16: function(input) {
            if (input == null) return "";
            return LZString2._compress(input, 15, function(a) {
              return f(a + 32);
            }) + " ";
          },
          decompressFromUTF16: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString2._decompress(compressed.length, 16384, function(index) {
              return compressed.charCodeAt(index) - 32;
            });
          },
          //compress into uint8array (UCS-2 big endian format)
          compressToUint8Array: function(uncompressed) {
            var compressed = LZString2.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2);
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
              var current_value = compressed.charCodeAt(i);
              buf[i * 2] = current_value >>> 8;
              buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
          },
          //decompress from uint8array (UCS-2 big endian format)
          decompressFromUint8Array: function(compressed) {
            if (compressed === null || compressed === void 0) {
              return LZString2.decompress(compressed);
            } else {
              var buf = new Array(compressed.length / 2);
              for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
              }
              var result = [];
              buf.forEach(function(c) {
                result.push(f(c));
              });
              return LZString2.decompress(result.join(""));
            }
          },
          //compress into a string that is already URI encoded
          compressToEncodedURIComponent: function(input) {
            if (input == null) return "";
            return LZString2._compress(input, 6, function(a) {
              return keyStrUriSafe.charAt(a);
            });
          },
          //decompress from an output of compressToEncodedURIComponent
          decompressFromEncodedURIComponent: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            input = input.replace(/ /g, "+");
            return LZString2._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrUriSafe, input.charAt(index));
            });
          },
          compress: function(uncompressed) {
            return LZString2._compress(uncompressed, 16, function(a) {
              return f(a);
            });
          },
          _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null) return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
              context_c = uncompressed.charAt(ii);
              if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
              }
              context_wc = context_w + context_c;
              if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
              } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                  if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  } else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1 | value;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  }
                  context_enlargeIn--;
                  if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                  }
                  delete context_dictionaryToCreate[context_w];
                } else {
                  value = context_dictionary[context_w];
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
              }
            }
            if (context_w !== "") {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
            }
            value = 2;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
            while (true) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
              } else context_data_position++;
            }
            return context_data.join("");
          },
          decompress: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString2._decompress(compressed.length, 32768, function(index) {
              return compressed.charCodeAt(index);
            });
          },
          _decompress: function(length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
              dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (next = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 2:
                return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
              if (data.index > length) {
                return "";
              }
              bits = 0;
              maxpower = Math.pow(2, numBits);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              switch (c = bits) {
                case 0:
                  bits = 0;
                  maxpower = Math.pow(2, 8);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 1:
                  bits = 0;
                  maxpower = Math.pow(2, 16);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 2:
                  return result.join("");
              }
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
              if (dictionary[c]) {
                entry = dictionary[c];
              } else {
                if (c === dictSize) {
                  entry = w + w.charAt(0);
                } else {
                  return null;
                }
              }
              result.push(entry);
              dictionary[dictSize++] = w + entry.charAt(0);
              enlargeIn--;
              w = entry;
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
            }
          }
        };
        return LZString2;
      })();
      if (typeof define === "function" && define.amd) {
        define(function() {
          return LZString;
        });
      } else if (typeof module !== "undefined" && module != null) {
        module.exports = LZString;
      } else if (typeof angular !== "undefined" && angular != null) {
        angular.module("LZString", []).factory("LZString", function() {
          return LZString;
        });
      }
    }
  });

  // node_modules/@testing-library/dom/dist/screen.js
  var require_screen = __commonJS({
    "node_modules/@testing-library/dom/dist/screen.js"(exports) {
      "use strict";
      var _interopRequireDefault = require_interopRequireDefault();
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.screen = void 0;
      var _lzString = _interopRequireDefault(require_lz_string());
      var _getQueriesForElement = require_get_queries_for_element();
      var _helpers = require_helpers();
      var _prettyDom = require_pretty_dom();
      var queries = _interopRequireWildcard(require_queries());
      function _interopRequireWildcard(e, t) {
        if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (_interopRequireWildcard = function(e2, t2) {
          if (!t2 && e2 && e2.__esModule) return e2;
          var o, i, f = { __proto__: null, default: e2 };
          if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
          if (o = t2 ? n : r) {
            if (o.has(e2)) return o.get(e2);
            o.set(e2, f);
          }
          for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
          return f;
        })(e, t);
      }
      function unindent(string) {
        return string.replace(/[ \t]*[\n][ \t]*/g, "\n");
      }
      function encode(value) {
        return _lzString.default.compressToEncodedURIComponent(unindent(value));
      }
      function getPlaygroundUrl(markup) {
        return `https://testing-playground.com/#markup=${encode(markup)}`;
      }
      var debug = (element, maxLength, options) => Array.isArray(element) ? element.forEach((el) => (0, _prettyDom.logDOM)(el, maxLength, options)) : (0, _prettyDom.logDOM)(element, maxLength, options);
      var logTestingPlaygroundURL = (element = (0, _helpers.getDocument)().body) => {
        if (!element || !("innerHTML" in element)) {
          console.log(`The element you're providing isn't a valid DOM element.`);
          return;
        }
        if (!element.innerHTML) {
          console.log(`The provided element doesn't have any children.`);
          return;
        }
        const playgroundUrl = getPlaygroundUrl(element.innerHTML);
        console.log(`Open this URL in your browser

${playgroundUrl}`);
        return playgroundUrl;
      };
      var initialValue = {
        debug,
        logTestingPlaygroundURL
      };
      var screen = exports.screen = typeof document !== "undefined" && document.body ? (0, _getQueriesForElement.getQueriesForElement)(document.body, queries, initialValue) : Object.keys(queries).reduce((helpers, key) => {
        helpers[key] = () => {
          throw new TypeError("For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error");
        };
        return helpers;
      }, initialValue);
    }
  });

  // node_modules/@testing-library/dom/dist/index.js
  var require_index = __commonJS({
    "node_modules/@testing-library/dom/dist/index.js"(exports) {
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _exportNames = {
        within: true,
        queries: true,
        queryHelpers: true,
        getDefaultNormalizer: true,
        getRoles: true,
        logRoles: true,
        isInaccessible: true,
        configure: true,
        getConfig: true
      };
      Object.defineProperty(exports, "configure", {
        enumerable: true,
        get: function() {
          return _config.configure;
        }
      });
      Object.defineProperty(exports, "getConfig", {
        enumerable: true,
        get: function() {
          return _config.getConfig;
        }
      });
      Object.defineProperty(exports, "getDefaultNormalizer", {
        enumerable: true,
        get: function() {
          return _matches.getDefaultNormalizer;
        }
      });
      Object.defineProperty(exports, "getRoles", {
        enumerable: true,
        get: function() {
          return _roleHelpers.getRoles;
        }
      });
      Object.defineProperty(exports, "isInaccessible", {
        enumerable: true,
        get: function() {
          return _roleHelpers.isInaccessible;
        }
      });
      Object.defineProperty(exports, "logRoles", {
        enumerable: true,
        get: function() {
          return _roleHelpers.logRoles;
        }
      });
      exports.queryHelpers = exports.queries = void 0;
      Object.defineProperty(exports, "within", {
        enumerable: true,
        get: function() {
          return _getQueriesForElement.getQueriesForElement;
        }
      });
      var _getQueriesForElement = require_get_queries_for_element();
      Object.keys(_getQueriesForElement).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _getQueriesForElement[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _getQueriesForElement[key];
          }
        });
      });
      var queries = _interopRequireWildcard(require_queries());
      exports.queries = queries;
      Object.keys(queries).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === queries[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return queries[key];
          }
        });
      });
      var queryHelpers = _interopRequireWildcard(require_query_helpers());
      exports.queryHelpers = queryHelpers;
      Object.keys(queryHelpers).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === queryHelpers[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return queryHelpers[key];
          }
        });
      });
      var _waitFor = require_wait_for();
      Object.keys(_waitFor).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _waitFor[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _waitFor[key];
          }
        });
      });
      var _waitForElementToBeRemoved = require_wait_for_element_to_be_removed();
      Object.keys(_waitForElementToBeRemoved).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _waitForElementToBeRemoved[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _waitForElementToBeRemoved[key];
          }
        });
      });
      var _matches = require_matches();
      var _getNodeText = require_get_node_text();
      Object.keys(_getNodeText).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _getNodeText[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _getNodeText[key];
          }
        });
      });
      var _events = require_events();
      Object.keys(_events).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _events[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _events[key];
          }
        });
      });
      var _screen = require_screen();
      Object.keys(_screen).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _screen[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _screen[key];
          }
        });
      });
      var _roleHelpers = require_role_helpers();
      var _prettyDom = require_pretty_dom();
      Object.keys(_prettyDom).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _prettyDom[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _prettyDom[key];
          }
        });
      });
      var _config = require_config();
      var _suggestions = require_suggestions();
      Object.keys(_suggestions).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
        if (key in exports && exports[key] === _suggestions[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _suggestions[key];
          }
        });
      });
      function _interopRequireWildcard(e, t) {
        if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (_interopRequireWildcard = function(e2, t2) {
          if (!t2 && e2 && e2.__esModule) return e2;
          var o, i, f = { __proto__: null, default: e2 };
          if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
          if (o = t2 ? n : r) {
            if (o.has(e2)) return o.get(e2);
            o.set(e2, f);
          }
          for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
          return f;
        })(e, t);
      }
    }
  });
  return require_index();
})();
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (** @license React v17.0.2
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
