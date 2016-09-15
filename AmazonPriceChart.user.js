// ==UserScript==
// @name           Amazon Price History Chart
// @author         DOCa Cola
// @license        GNU GPLv3
// @version        1.0
// @description    Adds CamelCamelCamel graph to Amazon product pages.
// @namespace      null
// @include        *://www.amazon.*/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js
// @grant          GM_xmlhttpRequest
// @connect        camelcamelcamel.com
// ==/UserScript==


const width = 800;
const height = 250;
const chart = "amazon-new-used"; //Possible other values are "amazon", "new", "used", "new-used", & "amazon-new-used"

const element = $(':input[id="ASIN"]');
const asin = $.trim(element.attr("value"));

if (asin.length) {
    // Retrieve top level domain name to determine correct country subdomain for camelcamelcamel
    const arr = document.domain.split(".");
    let country = arr[arr.length - 1];
    if (country=="com") {country = "us";}

    const link2 = `<a  target='blank' href='http://${country}.camelcamelcamel.com/product/${asin}'><img src='http://charts.camelcamelcamel.com/${country}/${asin}/${chart}.png?force=1&zero=0&w=${width}&h=${height}&desired=false&legend=1&ilt=1&tp=all&fo=0' /></a>`;
    const camelurl = `http://${country}.camelcamelcamel.com/product/${asin}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: camelurl,
        onload(response) {
            const innerHTML = `<div id='camelcamelcamel content pdClearfix' style='margin: 10px;'>${link2}</div>`;

            let insertHTML = "<div class=\"bucket\"><div class=\"a-divider a-divider-section\"></div><h2 class=\"default\">Price history</h2>";
            insertHTML += innerHTML;
            insertHTML += "</div>";
            insertHTML += "<hr size=\"1\" noshade=\"noshade\" class=\"bucketDivider\">";

            if ($("#descriptionAndDetails").length) {
                $("#descriptionAndDetails").prepend(insertHTML);
            }
            else if ($("#ask-btf_feature_div").length) {
                $("#ask-btf_feature_div").prepend(insertHTML);
            }

        }
    });
}
