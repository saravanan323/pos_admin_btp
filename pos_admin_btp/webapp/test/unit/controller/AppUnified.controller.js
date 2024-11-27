/*global QUnit*/

sap.ui.define([
	"com/pos_admin_btp/controller/AppUnified.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AppUnified Controller");

	QUnit.test("I should test the AppUnified controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
