// ==UserScript==
// @name              Kyujitai Converter
// @name:ja-JP        舊字體コンバーター(旧字体コンバーター)
// @namespace         https://github.com/
// @version           0.90.1
// @description       Change the Kanjis to the old fonts.
// @description:ja-JP 漢字を舊字體に變更する。
// @author            Ostrichbeta Chan
// @license           GPL-3.0
// @match             *://*/*
// @icon              data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require           https://code.jquery.com/jquery-3.6.1.min.js
// @require           https://raw.githubusercontent.com/mholt/PapaParse/master/papaparse.min.js
// @grant             GM_xmlhttpRequest
// @connect           raw.githubusercontent.com
// @run-at            document-end
// ==/UserScript==

(function() {
    window.jQuery361 = $.noConflict(true); // Avoid the confliction with the original page

    const kyujitaiCSVURL = "https://raw.githubusercontent.com/Ostrichbeta/kyujitai-conversion/main/convert.csv";

    // Recursively traverse the given node and its descendants (Depth-first search)
    function scanTextNodes(node, ref) {
        let lang = document.documentElement.lang;
        if (!(["ja", "ja-JP"].includes(lang))) {
            return;
        }
        // The node could have been detached from the DOM tree
        if (!node.parentNode || !document.body.contains(node)) {
            return;
        }

        // Ignore text boxes and echoes
        var excludeTags = {ruby: true, script: true, select: true, textarea: true};

        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) {
                return;
            }
            return node.childNodes.forEach((element) => scanTextNodes(element, ref));

        case Node.TEXT_NODE:
            ((node = convertNode(node, ref)));
        }
    }

    function convertNode(node, ref) {
        node.nodeValue = convertText(node.nodeValue, ref);
        return node;
    }

    function convertTitle(title, ref){
        document.title = convertText(title, ref);
    }

    function convertText(text, ref) {
        if (! (ref instanceof Array)) {
            console.error("Invalid ref.");
            return "";
        }

        let originalText = text;
        for (let index = ref.length - 1; index >= 0; index--) {
            currentRef = ref[index];
            shinList = currentRef.map((item) => item["New"]);
            shinConv = currentRef.reduce(function(map, obj) {
                map[obj["New"]] = obj["Old"];
                return map;
            }, {});
            regexPattern = new RegExp("(" + shinList.join("|") + ")", "g");
            originalText = originalText.replace(regexPattern, ((m) => (shinConv[m])));
        }
        return originalText;
    }

    var s = GM_xmlhttpRequest({
        method: "GET",
        url: kyujitaiCSVURL,
        onload: function(response) {
            csvObj = response.responseText;
            try {
                console.log("Kyujitai Converter: Successfully loaded from GitHub.")
                jsonOBJ = Papa.parse(csvObj, {header: true});
                jsonOBJ["data"] = jsonOBJ["data"].filter((item) => Object.keys(item).length == 2);
                arrayByLength = [];
                let i = 1;
                let count = 0;
                while (count < jsonOBJ["data"].length) {
                    lengthList = jsonOBJ["data"].filter((item) => item["New"].length == i);
                    arrayByLength.push(lengthList);
                    count += lengthList.length;
                    i += 1;
                };

                setInterval(scanTextNodes, 1000, document.body, arrayByLength);
                setInterval(convertTitle, 1000, document.title, arrayByLength);
                debugger
            } catch (error) {
                console.error("An error occurred while processing database.", error)
            }
        },
        onerror: function(response) {
            console.error("Could not fetch the conversion database.", response.statusText);
        }
    })
})();