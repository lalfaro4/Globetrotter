(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['flight-activity.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"planner-activity\">\r\n    <label class=\"\">\r\n        <input type=\"radio\" name=\"planner-selected-activity\" checked />\r\n        <div class=\"round planner-activity-header\">\r\n            <div class=\"planner-activity-numeral\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":5,"column":50},"end":{"line":5,"column":59}}}) : helper)))
    + "</div>\r\n\r\n            <input type=\"text\" class=\"round planner-activity-origin-input\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"origin_airport_code") || (depth0 != null ? lookupProperty(depth0,"origin_airport_code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"origin_airport_code","hash":{},"data":data,"loc":{"start":{"line":7,"column":82},"end":{"line":7,"column":105}}}) : helper)))
    + "\"\r\n                list=\"planner-origin-airports-"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":8,"column":46},"end":{"line":8,"column":55}}}) : helper)))
    + "\" placeholder=\"Origin\" />\r\n            <datalist type=\"datalist\" id=\"planner-origin-airports-"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":9,"column":66},"end":{"line":9,"column":75}}}) : helper)))
    + "\"></datalist>\r\n\r\n            <div style=\"text-align: center;\">to</div>\r\n\r\n            <input type=\"text\" class=\"round planner-activity-destination-input\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"destination_airport_code") || (depth0 != null ? lookupProperty(depth0,"destination_airport_code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"destination_airport_code","hash":{},"data":data,"loc":{"start":{"line":13,"column":87},"end":{"line":13,"column":115}}}) : helper)))
    + "\"\r\n                list=\"planner-destination-airports-"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":14,"column":51},"end":{"line":14,"column":60}}}) : helper)))
    + "\" placeholder=\"Destination\" />\r\n            <datalist type=\"datalist\" id=\"planner-destination-airports-"
    + alias4(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":15,"column":71},"end":{"line":15,"column":80}}}) : helper)))
    + "\"></datalist>\r\n\r\n            <input type=\"date\" class=\"round planner-activity-departure-date\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"departure_date") || (depth0 != null ? lookupProperty(depth0,"departure_date") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"departure_date","hash":{},"data":data,"loc":{"start":{"line":17,"column":84},"end":{"line":17,"column":102}}}) : helper)))
    + "\" />\r\n            <input type=\"button\" class=\"round basic-button planner-search-activity-button\" value=\"Search\" />\r\n            <input type=\"button\" class=\"round basic-button planner-remove-activity-button\" value=\"Remove\" />\r\n        </div>\r\n    </label>\r\n    <div class=\"round planner-activity-child-container\"></div>\r\n</div>";
},"useData":true});
})();