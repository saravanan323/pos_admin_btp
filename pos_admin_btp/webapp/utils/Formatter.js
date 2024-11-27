sap.ui.define([], function () {
    "use strict";
    return {
        isNavigated(sNavigatedItemId, sItemId) {
            return sNavigatedItemId == sItemId;
        },
        showHideFullScreen(val1, val2) {
            return (val1 != null && val2 != null) ? true : false;
        },
        dateFormat(date) {
            if (date)
                return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", "-");
        },
        isNavigated(sNavigatedItemId, sItemId) {
            return sNavigatedItemId === sItemId;
        },
        dateTimeConvertion(date, time) {
            if (data && time) {
                let originalDate = new Date(date),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd" + time,
                    })
                return dateFormat.format(originalDate, time);
            }
        },
        statusText(value) {
            if (value) {
                return value == 2 ? 'Active' : value === 3 ? 'Inactive' : 'Draft';
            }
        },
        statusState(value) {
            if (value)
                return value == 2 ? "Success" : value == 3 ? "Error" : "None";
        }
    };
});