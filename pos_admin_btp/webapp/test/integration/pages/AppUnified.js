sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "AppUnified";
	
	Opa5.createPageObjects({
		onTheViewPage: {

			actions: {},

			assertions: {

				iShouldSeeThePageView() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success() {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
				}
			}
		}
	});

});
