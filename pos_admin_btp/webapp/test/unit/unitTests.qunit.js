/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/pos_admin_btp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
