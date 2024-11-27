sap.ui.define([
    "sap/ui/core/util/MockServer"
], (MockServer) => {
    "use strict";

    return {
        init() {
            // create
            const oMockServer = new MockServer({
                rootUri: sap.ui.require.toUrl("com/posadminbtp") + "/V2/Northwind/Northwind.svc/"
            });

            const oUrlParams = new URLSearchParams(window.location.search);

            // configure mock server with a delay
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUrlParams.get("serverDelay") || 500
            });

            oMockServer.simulate("../localService/metadata.xml", {
                sMockdataBaseUrl: "../localService/mockdata",
                bGenerateMissingMockData: true
            });

            // simulate
            /* onst sPath = sap.ui.require.toUrl("com/posadminbtp/local_service");
            oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata"); */

            // handling custom URL parameter step
            /* var fnCustom = function (oEvent) {
                var oXhr = oEvent.getParameter("oXhr");
                if (oXhr && oXhr.url.indexOf("first") > -1) {
                    oEvent.getParameter("oFilteredData").results.splice(3, 100);
                }
            };
            oMockServer.attachAfter("GET", fnCustom, "Invoices"); */

            // start
            oMockServer.start();
        }
    };
});
