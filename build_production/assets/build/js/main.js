!function(e){var n={};function t(a){if(n[a])return n[a].exports;var i=n[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(a,i,function(n){return e[n]}.bind(null,i));return a},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=0)}({0:function(e,n,t){t("BSPe"),e.exports=t("olAV")},"7oys":function(e,n){e.exports=function(e){var n={begin:/(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,returnBegin:!0,end:";",endsWithParent:!0,contains:[{className:"attribute",begin:/\S/,end:":",excludeEnd:!0,starts:{endsWithParent:!0,excludeEnd:!0,contains:[{begin:/[\w-]+\(/,returnBegin:!0,contains:[{className:"built_in",begin:/[\w-]+/},{begin:/\(/,end:/\)/,contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.CSS_NUMBER_MODE]}]},e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,e.C_BLOCK_COMMENT_MODE,{className:"number",begin:"#[0-9A-Fa-f]+"},{className:"meta",begin:"!important"}]}}]};return{case_insensitive:!0,illegal:/[=\/|'\$]/,contains:[e.C_BLOCK_COMMENT_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/},{className:"selector-class",begin:/\.[A-Za-z0-9_-]+/},{className:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},{className:"selector-pseudo",begin:/:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/},{begin:"@(page|font-face)",lexemes:"@[a-z-]+",keywords:"@page @font-face"},{begin:"@",end:"[{;]",illegal:/:/,returnBegin:!0,contains:[{className:"keyword",begin:/@\-?\w[\w]*(\-\w+)*/},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:"and or not only",contains:[{begin:/[a-z-]+:/,className:"attribute"},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"[a-zA-Z-][a-zA-Z0-9_-]*",relevance:0},{begin:"{",end:"}",illegal:/\S/,contains:[e.C_BLOCK_COMMENT_MODE,n]}]}}},"8Pgg":function(e,n){e.exports=function(e){var n={className:"variable",variants:[{begin:/\$[\w\d#@][\w\d_]*/},{begin:/\$\{(.*?)}/}]},t={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n,{className:"variable",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]}]};return{aliases:["sh","zsh"],lexemes:/\b-?[a-z\._]+\b/,keywords:{keyword:"if then else elif fi for while in do done case esac function",literal:"true false",built_in:"break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",_:"-ne -eq -lt -gt -f -d -e -s -l -a"},contains:[{className:"meta",begin:/^#![^\n]+sh\s*$/,relevance:10},{className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},e.HASH_COMMENT_MODE,t,{className:"",begin:/\\"/},{className:"string",begin:/'/,end:/'/},n]}}},BLBw:function(e,n){e.exports=function(e){return{aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$"},{begin:"^.+?\\n[=-]{2,}$"}]},{begin:"<",end:">",subLanguage:"xml",relevance:0},{className:"bullet",begin:"^\\s*([*+-]|(\\d+\\.))\\s+"},{className:"strong",begin:"[*_]{2}.+?[*_]{2}"},{className:"emphasis",variants:[{begin:"\\*.+?\\*"},{begin:"_.+?_",relevance:0}]},{className:"quote",begin:"^>\\s+",end:"$"},{className:"code",variants:[{begin:"^```\\w*\\s*$",end:"^```[ ]*$"},{begin:"`.+?`"},{begin:"^( {4}|\\t)",end:"$",relevance:0}]},{begin:"^[-\\*]{3,}",end:"$"},{begin:"\\[.+?\\][\\(\\[].*?[\\)\\]]",returnBegin:!0,contains:[{className:"string",begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0,relevance:0},{className:"link",begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}],relevance:10},{begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]}]}}},BSPe:function(e,n,t){"use strict";t.r(n);var a=t("pw5m"),i=t.n(a);i.a.registerLanguage("bash",t("8Pgg")),i.a.registerLanguage("css",t("7oys")),i.a.registerLanguage("html",t("jctj")),i.a.registerLanguage("javascript",t("TdF3")),i.a.registerLanguage("json",t("WtIr")),i.a.registerLanguage("markdown",t("BLBw")),i.a.registerLanguage("php",t("KQfT")),i.a.registerLanguage("scss",t("YROV")),i.a.registerLanguage("yaml",t("Lns6")),document.querySelectorAll("pre code").forEach((function(e){i.a.highlightBlock(e)}))},KQfT:function(e,n){e.exports=function(e){var n={begin:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},t={className:"meta",begin:/<\?(php)?|\?>/},a={className:"string",contains:[e.BACKSLASH_ESCAPE,t],variants:[{begin:'b"',end:'"'},{begin:"b'",end:"'"},e.inherit(e.APOS_STRING_MODE,{illegal:null}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null})]},i={variants:[e.BINARY_NUMBER_MODE,e.C_NUMBER_MODE]};return{aliases:["php","php3","php4","php5","php6","php7"],case_insensitive:!0,keywords:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",contains:[e.HASH_COMMENT_MODE,e.COMMENT("//","$",{contains:[t]}),e.COMMENT("/\\*","\\*/",{contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),e.COMMENT("__halt_compiler.+?;",!1,{endsWithParent:!0,keywords:"__halt_compiler",lexemes:e.UNDERSCORE_IDENT_RE}),{className:"string",begin:/<<<['"]?\w+['"]?$/,end:/^\w+;?$/,contains:[e.BACKSLASH_ESCAPE,{className:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]}]},t,{className:"keyword",begin:/\$this\b/},n,{begin:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{className:"function",beginKeywords:"function",end:/[;{]/,excludeEnd:!0,illegal:"\\$|\\[|%",contains:[e.UNDERSCORE_TITLE_MODE,{className:"params",begin:"\\(",end:"\\)",contains:["self",n,e.C_BLOCK_COMMENT_MODE,a,i]}]},{className:"class",beginKeywords:"class interface",end:"{",excludeEnd:!0,illegal:/[:\(\$"]/,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",end:";",illegal:/[\.']/,contains:[e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"use",end:";",contains:[e.UNDERSCORE_TITLE_MODE]},{begin:"=>"},a,i]}}},Lns6:function(e,n){e.exports=function(e){var n={className:"string",relevance:0,variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,{className:"template-variable",variants:[{begin:"{{",end:"}}"},{begin:"%{",end:"}"}]}]};return{case_insensitive:!0,aliases:["yml","YAML","yaml"],contains:[{className:"attr",variants:[{begin:"\\w[\\w :\\/.-]*:(?=[ \t]|$)"},{begin:'"\\w[\\w :\\/.-]*":(?=[ \t]|$)'},{begin:"'\\w[\\w :\\/.-]*':(?=[ \t]|$)"}]},{className:"meta",begin:"^---s*$",relevance:10},{className:"string",begin:"[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!"+e.UNDERSCORE_IDENT_RE},{className:"type",begin:"!!"+e.UNDERSCORE_IDENT_RE},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"\\-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:"true false yes no null",keywords:{literal:"true false yes no null"}},{className:"number",begin:e.C_NUMBER_RE+"\\b"},n]}}},TdF3:function(e,n){e.exports=function(e){var n="<>",t="</>",a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/},i="[A-Za-z$_][0-9A-Za-z$_]*",r={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},s={className:"number",variants:[{begin:"\\b(0[bB][01]+)n?"},{begin:"\\b(0[oO][0-7]+)n?"},{begin:e.C_NUMBER_RE+"n?"}],relevance:0},o={className:"subst",begin:"\\$\\{",end:"\\}",keywords:r,contains:[]},l={begin:"html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"xml"}},c={begin:"css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,o],subLanguage:"css"}},d={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,o]};o.contains=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,d,s,e.REGEXP_MODE];var u=o.contains.concat([e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]);return{aliases:["js","jsx","mjs","cjs"],keywords:r,contains:[{className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},{className:"meta",begin:/^#!/,end:/$/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,l,c,d,e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+",contains:[{className:"type",begin:"\\{",end:"\\}",relevance:0},{className:"variable",begin:i+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,s,{begin:/[{,\n]\s*/,relevance:0,contains:[{begin:i+"\\s*:",returnBegin:!0,relevance:0,contains:[{className:"attr",begin:i,relevance:0}]}]},{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.REGEXP_MODE,{className:"function",begin:"(\\(.*?\\)|"+i+")\\s*=>",returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:i},{begin:/\(\s*\)/},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:u}]}]},{className:"",begin:/\s/,end:/\s*/,skip:!0},{variants:[{begin:n,end:t},{begin:a.begin,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}],relevance:0},{className:"function",beginKeywords:"function",end:/\{/,excludeEnd:!0,contains:[e.inherit(e.TITLE_MODE,{begin:i}),{className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,contains:u}],illegal:/\[|%/},{begin:/\$[(.]/},e.METHOD_GUARD,{className:"class",beginKeywords:"class",end:/[{;=]/,excludeEnd:!0,illegal:/[:"\[\]]/,contains:[{beginKeywords:"extends"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"constructor get set",end:/\{/,excludeEnd:!0}],illegal:/#(?!!)/}}},WtIr:function(e,n){e.exports=function(e){var n={literal:"true false null"},t=[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],a=[e.QUOTE_STRING_MODE,e.C_NUMBER_MODE],i={end:",",endsWithParent:!0,excludeEnd:!0,contains:a,keywords:n},r={begin:"{",end:"}",contains:[{className:"attr",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE],illegal:"\\n"},e.inherit(i,{begin:/:/})].concat(t),illegal:"\\S"},s={begin:"\\[",end:"\\]",contains:[e.inherit(i)],illegal:"\\S"};return a.push(r,s),t.forEach((function(e){a.push(e)})),{contains:a,keywords:n,illegal:"\\S"}}},YROV:function(e,n){e.exports=function(e){var n={className:"variable",begin:"(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"},t={className:"number",begin:"#[0-9A-Fa-f]+"};e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,e.C_BLOCK_COMMENT_MODE;return{case_insensitive:!0,illegal:"[=/|']",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"selector-id",begin:"\\#[A-Za-z0-9_-]+",relevance:0},{className:"selector-class",begin:"\\.[A-Za-z0-9_-]+",relevance:0},{className:"selector-attr",begin:"\\[",end:"\\]",illegal:"$"},{className:"selector-tag",begin:"\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",relevance:0},{className:"selector-pseudo",begin:":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"},{className:"selector-pseudo",begin:"::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"},n,{className:"attribute",begin:"\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",illegal:"[^\\s]"},{begin:"\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"},{begin:":",end:";",contains:[n,t,e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{className:"meta",begin:"!important"}]},{begin:"@(page|font-face)",lexemes:"@[a-z-]+",keywords:"@page @font-face"},{begin:"@",end:"[{;]",returnBegin:!0,keywords:"and or not only",contains:[{begin:"@[a-z-]+",className:"keyword"},n,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,t,e.CSS_NUMBER_MODE]}]}}},jctj:function(e,n){e.exports=function(e){var n={className:"symbol",begin:"&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;"},t={begin:"\\s",contains:[{className:"meta-keyword",begin:"#?[a-z_][a-z1-9_-]+",illegal:"\\n"}]},a=e.inherit(t,{begin:"\\(",end:"\\)"}),i=e.inherit(e.APOS_STRING_MODE,{className:"meta-string"}),r=e.inherit(e.QUOTE_STRING_MODE,{className:"meta-string"}),s={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:"[A-Za-z0-9\\._:-]+",relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[n]},{begin:/'/,end:/'/,contains:[n]},{begin:/[^\s"'=<>`]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,contains:[{className:"meta",begin:"<![a-z]",end:">",relevance:10,contains:[t,r,i,a,{begin:"\\[",end:"\\]",contains:[{className:"meta",begin:"<![a-z]",end:">",contains:[t,a,r,i]}]}]},e.COMMENT("\x3c!--","--\x3e",{relevance:10}),{begin:"<\\!\\[CDATA\\[",end:"\\]\\]>",relevance:10},n,{className:"meta",begin:/<\?xml/,end:/\?>/,relevance:10},{begin:/<\?(php)?/,end:/\?>/,subLanguage:"php",contains:[{begin:"/\\*",end:"\\*/",skip:!0},{begin:'b"',end:'"',skip:!0},{begin:"b'",end:"'",skip:!0},e.inherit(e.APOS_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null,className:null,contains:null,skip:!0})]},{className:"tag",begin:"<style(?=\\s|>)",end:">",keywords:{name:"style"},contains:[s],starts:{end:"</style>",returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:"<script(?=\\s|>)",end:">",keywords:{name:"script"},contains:[s],starts:{end:"<\/script>",returnEnd:!0,subLanguage:["actionscript","javascript","handlebars","xml"]}},{className:"tag",begin:"</?",end:"/?>",contains:[{className:"name",begin:/[^\/><\s]+/,relevance:0},s]}]}}},olAV:function(e,n){},pw5m:function(e,n,t){var a,i,r;i=function(e){var n=[],t=Object.keys,a={},i={},r=!0,s=/^(no-?highlight|plain|text)$/i,o=/\blang(?:uage)?-([\w-]+)\b/i,l=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,c="Could not find the language '{}', did you forget to load/include a language module?",d={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},u="of and for in not or if then".split(" ");function g(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function b(e){return e.nodeName.toLowerCase()}function f(e){return s.test(e)}function m(e){var n,t={},a=Array.prototype.slice.call(arguments,1);for(n in e)t[n]=e[n];return a.forEach((function(e){for(n in e)t[n]=e[n]})),t}function p(e){var n=[];return function e(t,a){for(var i=t.firstChild;i;i=i.nextSibling)3===i.nodeType?a+=i.nodeValue.length:1===i.nodeType&&(n.push({event:"start",offset:a,node:i}),a=e(i,a),b(i).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:i}));return a}(e,0),n}function E(e){return e.variants&&!e.cached_variants&&(e.cached_variants=e.variants.map((function(n){return m(e,{variants:null},n)}))),e.cached_variants?e.cached_variants:function e(n){return!!n&&(n.endsWithParent||e(n.starts))}(e)?[m(e,{starts:e.starts?m(e.starts):null})]:Object.isFrozen(e)?[m(e)]:[e]}function _(e,n){return n?Number(n):(t=e,-1!=u.indexOf(t.toLowerCase())?0:1);var t}function h(e){function n(e){return e&&e.source||e}function a(t,a){return new RegExp(n(t),"m"+(e.case_insensitive?"i":"")+(a?"g":""))}function i(e){var t,i,r={},s=[],o={},l=1;function c(e,n){r[l]=e,s.push([e,n]),l+=function(e){return new RegExp(e.toString()+"|").exec("").length-1}(n)+1}for(var d=0;d<e.contains.length;d++)c(i=e.contains[d],i.beginKeywords?"\\.?(?:"+i.begin+")\\.?":i.begin);e.terminator_end&&c("end",e.terminator_end),e.illegal&&c("illegal",e.illegal);var u=s.map((function(e){return e[1]}));return t=a(function(e,t){for(var a=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,i=0,r="",s=0;s<e.length;s++){var o=i+=1,l=n(e[s]);for(s>0&&(r+=t),r+="(";l.length>0;){var c=a.exec(l);if(null==c){r+=l;break}r+=l.substring(0,c.index),l=l.substring(c.index+c[0].length),"\\"==c[0][0]&&c[1]?r+="\\"+String(Number(c[1])+o):(r+=c[0],"("==c[0]&&i++)}r+=")"}return r}(u,"|"),!0),o.lastIndex=0,o.exec=function(n){var a;if(0===s.length)return null;t.lastIndex=o.lastIndex;var i=t.exec(n);if(!i)return null;for(var l=0;l<i.length;l++)if(null!=i[l]&&null!=r[""+l]){a=r[""+l];break}return"string"==typeof a?(i.type=a,i.extra=[e.illegal,e.terminator_end]):(i.type="begin",i.rule=a),i},o}if(e.contains&&-1!=e.contains.indexOf("self")){if(!r)throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");e.contains=e.contains.filter((function(e){return"self"!=e}))}!function r(s,o){s.compiled||(s.compiled=!0,s.keywords=s.keywords||s.beginKeywords,s.keywords&&(s.keywords=function(e,n){var a={};return"string"==typeof e?i("keyword",e):t(e).forEach((function(n){i(n,e[n])})),a;function i(e,t){n&&(t=t.toLowerCase()),t.split(" ").forEach((function(n){var t=n.split("|");a[t[0]]=[e,_(t[0],t[1])]}))}}(s.keywords,e.case_insensitive)),s.lexemesRe=a(s.lexemes||/\w+/,!0),o&&(s.beginKeywords&&(s.begin="\\b("+s.beginKeywords.split(" ").join("|")+")\\b"),s.begin||(s.begin=/\B|\b/),s.beginRe=a(s.begin),s.endSameAsBegin&&(s.end=s.begin),s.end||s.endsWithParent||(s.end=/\B|\b/),s.end&&(s.endRe=a(s.end)),s.terminator_end=n(s.end)||"",s.endsWithParent&&o.terminator_end&&(s.terminator_end+=(s.end?"|":"")+o.terminator_end)),s.illegal&&(s.illegalRe=a(s.illegal)),null==s.relevance&&(s.relevance=1),s.contains||(s.contains=[]),s.contains=Array.prototype.concat.apply([],s.contains.map((function(e){return E("self"===e?s:e)}))),s.contains.forEach((function(e){r(e,s)})),s.starts&&r(s.starts,o),s.terminators=i(s))}(e)}function N(e,n,t,i){var s=n;function o(e,n){var t=_.case_insensitive?n[0].toLowerCase():n[0];return e.keywords.hasOwnProperty(t)&&e.keywords[t]}function l(e,n,t,a){if(!t&&""===n)return"";if(!e)return n;var i='<span class="'+(a?"":d.classPrefix);return(i+=e+'">')+n+(t?"":"</span>")}function u(){w+=null!=M.subLanguage?function(){var e="string"==typeof M.subLanguage;if(e&&!a[M.subLanguage])return g(R);var n=e?N(M.subLanguage,R,!0,y[M.subLanguage]):v(R,M.subLanguage.length?M.subLanguage:void 0);return M.relevance>0&&(x+=n.relevance),e&&(y[M.subLanguage]=n.top),l(n.language,n.value,!1,!0)}():function(){var e,n,t,a;if(!M.keywords)return g(R);for(a="",n=0,M.lexemesRe.lastIndex=0,t=M.lexemesRe.exec(R);t;)a+=g(R.substring(n,t.index)),(e=o(M,t))?(x+=e[1],a+=l(e[0],g(t[0]))):a+=g(t[0]),n=M.lexemesRe.lastIndex,t=M.lexemesRe.exec(R);return a+g(R.substr(n))}(),R=""}function b(e){w+=e.className?l(e.className,"",!0):"",M=Object.create(e,{parent:{value:M}})}function f(e){var n=e[0],t=e.rule;return t&&t.endSameAsBegin&&(t.endRe=new RegExp(n.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")),t.skip?R+=n:(t.excludeBegin&&(R+=n),u(),t.returnBegin||t.excludeBegin||(R=n)),b(t),t.returnBegin?0:n.length}function m(e){var n=e[0],t=s.substr(e.index),a=function e(n,t){if(function(e,n){var t=e&&e.exec(n);return t&&0===t.index}(n.endRe,t)){for(;n.endsParent&&n.parent;)n=n.parent;return n}if(n.endsWithParent)return e(n.parent,t)}(M,t);if(a){var i=M;i.skip?R+=n:(i.returnEnd||i.excludeEnd||(R+=n),u(),i.excludeEnd&&(R=n));do{M.className&&(w+="</span>"),M.skip||M.subLanguage||(x+=M.relevance),M=M.parent}while(M!==a.parent);return a.starts&&(a.endSameAsBegin&&(a.starts.endRe=a.endRe),b(a.starts)),i.returnEnd?0:n.length}}var p={};function E(e,n){var a=n&&n[0];if(R+=e,null==a)return u(),0;if("begin"==p.type&&"end"==n.type&&p.index==n.index&&""===a)return R+=s.slice(n.index,n.index+1),1;if(p=n,"begin"===n.type)return f(n);if("illegal"===n.type&&!t)throw new Error('Illegal lexeme "'+a+'" for mode "'+(M.className||"<unnamed>")+'"');if("end"===n.type){var i=m(n);if(null!=i)return i}return R+=a,a.length}var _=S(e);if(!_)throw console.error(c.replace("{}",e)),new Error('Unknown language: "'+e+'"');h(_);var O,M=i||_,y={},w="";for(O=M;O!==_;O=O.parent)O.className&&(w=l(O.className,"",!0)+w);var R="",x=0;try{for(var C,T,A=0;M.terminators.lastIndex=A,C=M.terminators.exec(s);)T=E(s.substring(A,C.index),C),A=C.index+T;for(E(s.substr(A)),O=M;O.parent;O=O.parent)O.className&&(w+="</span>");return{relevance:x,value:w,illegal:!1,language:e,top:M}}catch(n){if(n.message&&-1!==n.message.indexOf("Illegal"))return{illegal:!0,relevance:0,value:g(s)};if(r)return{relevance:0,value:g(s),language:e,top:M,errorRaised:n};throw n}}function v(e,n){n=n||d.languages||t(a);var i={relevance:0,value:g(e)},r=i;return n.filter(S).filter(R).forEach((function(n){var t=N(n,e,!1);t.language=n,t.relevance>r.relevance&&(r=t),t.relevance>i.relevance&&(r=i,i=t)})),r.language&&(i.second_best=r),i}function O(e){return d.tabReplace||d.useBR?e.replace(l,(function(e,n){return d.useBR&&"\n"===e?"<br>":d.tabReplace?n.replace(/\t/g,d.tabReplace):""})):e}function M(e){var t,a,r,s,l,u=function(e){var n,t,a,i,r=e.className+" ";if(r+=e.parentNode?e.parentNode.className:"",t=o.exec(r)){var s=S(t[1]);return s||(console.warn(c.replace("{}",t[1])),console.warn("Falling back to no-highlight mode for this block.",e)),s?t[1]:"no-highlight"}for(n=0,a=(r=r.split(/\s+/)).length;n<a;n++)if(f(i=r[n])||S(i))return i}(e);f(u)||(d.useBR?(t=document.createElement("div")).innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n"):t=e,l=t.textContent,r=u?N(u,l,!0):v(l),(a=p(t)).length&&((s=document.createElement("div")).innerHTML=r.value,r.value=function(e,t,a){var i=0,r="",s=[];function o(){return e.length&&t.length?e[0].offset!==t[0].offset?e[0].offset<t[0].offset?e:t:"start"===t[0].event?e:t:e.length?e:t}function l(e){r+="<"+b(e)+n.map.call(e.attributes,(function(e){return" "+e.nodeName+'="'+g(e.value).replace(/"/g,"&quot;")+'"'})).join("")+">"}function c(e){r+="</"+b(e)+">"}function d(e){("start"===e.event?l:c)(e.node)}for(;e.length||t.length;){var u=o();if(r+=g(a.substring(i,u[0].offset)),i=u[0].offset,u===e){s.reverse().forEach(c);do{d(u.splice(0,1)[0]),u=o()}while(u===e&&u.length&&u[0].offset===i);s.reverse().forEach(l)}else"start"===u[0].event?s.push(u[0].node):s.pop(),d(u.splice(0,1)[0])}return r+g(a.substr(i))}(a,p(s),l)),r.value=O(r.value),e.innerHTML=r.value,e.className=function(e,n,t){var a=n?i[n]:t,r=[e.trim()];return e.match(/\bhljs\b/)||r.push("hljs"),-1===e.indexOf(a)&&r.push(a),r.join(" ").trim()}(e.className,u,r.language),e.result={language:r.language,re:r.relevance},r.second_best&&(e.second_best={language:r.second_best.language,re:r.second_best.relevance}))}function y(){if(!y.called){y.called=!0;var e=document.querySelectorAll("pre code");n.forEach.call(e,M)}}var w={disableAutodetect:!0};function S(e){return e=(e||"").toLowerCase(),a[e]||a[i[e]]}function R(e){var n=S(e);return n&&!n.disableAutodetect}return e.highlight=N,e.highlightAuto=v,e.fixMarkup=O,e.highlightBlock=M,e.configure=function(e){d=m(d,e)},e.initHighlighting=y,e.initHighlightingOnLoad=function(){window.addEventListener("DOMContentLoaded",y,!1),window.addEventListener("load",y,!1)},e.registerLanguage=function(n,t){var s;try{s=t(e)}catch(e){if(console.error("Language definition for '{}' could not be registered.".replace("{}",n)),!r)throw e;console.error(e),s=w}a[n]=s,s.rawDefinition=t.bind(null,e),s.aliases&&s.aliases.forEach((function(e){i[e]=n}))},e.listLanguages=function(){return t(a)},e.getLanguage=S,e.requireLanguage=function(e){var n=S(e);if(n)return n;throw new Error("The '{}' language is required, but not loaded.".replace("{}",e))},e.autoDetection=R,e.inherit=m,e.debugMode=function(){r=!1},e.IDENT_RE="[a-zA-Z]\\w*",e.UNDERSCORE_IDENT_RE="[a-zA-Z_]\\w*",e.NUMBER_RE="\\b\\d+(\\.\\d+)?",e.C_NUMBER_RE="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BINARY_NUMBER_RE="\\b(0b[01]+)",e.RE_STARTERS_RE="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BACKSLASH_ESCAPE={begin:"\\\\[\\s\\S]",relevance:0},e.APOS_STRING_MODE={className:"string",begin:"'",end:"'",illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},e.QUOTE_STRING_MODE={className:"string",begin:'"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},e.PHRASAL_WORDS_MODE={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},e.COMMENT=function(n,t,a){var i=e.inherit({className:"comment",begin:n,end:t,contains:[]},a||{});return i.contains.push(e.PHRASAL_WORDS_MODE),i.contains.push({className:"doctag",begin:"(?:TODO|FIXME|NOTE|BUG|XXX):",relevance:0}),i},e.C_LINE_COMMENT_MODE=e.COMMENT("//","$"),e.C_BLOCK_COMMENT_MODE=e.COMMENT("/\\*","\\*/"),e.HASH_COMMENT_MODE=e.COMMENT("#","$"),e.NUMBER_MODE={className:"number",begin:e.NUMBER_RE,relevance:0},e.C_NUMBER_MODE={className:"number",begin:e.C_NUMBER_RE,relevance:0},e.BINARY_NUMBER_MODE={className:"number",begin:e.BINARY_NUMBER_RE,relevance:0},e.CSS_NUMBER_MODE={className:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},e.REGEXP_MODE={className:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[e.BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[e.BACKSLASH_ESCAPE]}]},e.TITLE_MODE={className:"title",begin:e.IDENT_RE,relevance:0},e.UNDERSCORE_TITLE_MODE={className:"title",begin:e.UNDERSCORE_IDENT_RE,relevance:0},e.METHOD_GUARD={begin:"\\.\\s*"+e.UNDERSCORE_IDENT_RE,relevance:0},[e.BACKSLASH_ESCAPE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.PHRASAL_WORDS_MODE,e.COMMENT,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.HASH_COMMENT_MODE,e.NUMBER_MODE,e.C_NUMBER_MODE,e.BINARY_NUMBER_MODE,e.CSS_NUMBER_MODE,e.REGEXP_MODE,e.TITLE_MODE,e.UNDERSCORE_TITLE_MODE,e.METHOD_GUARD].forEach((function(e){!function e(n){Object.freeze(n);var t="function"==typeof n;return Object.getOwnPropertyNames(n).forEach((function(a){!n.hasOwnProperty(a)||null===n[a]||"object"!=typeof n[a]&&"function"!=typeof n[a]||t&&("caller"===a||"callee"===a||"arguments"===a)||Object.isFrozen(n[a])||e(n[a])})),n}(e)})),e},r="object"==typeof window&&window||"object"==typeof self&&self,n.nodeType?r&&(r.hljs=i({}),void 0===(a=function(){return r.hljs}.apply(n,[]))||(e.exports=a)):i(n)}});