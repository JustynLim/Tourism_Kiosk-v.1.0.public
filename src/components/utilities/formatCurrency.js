"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = void 0;
var CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "MYR",
    style: "currency",
});
function formatCurrency(number) {
    return CURRENCY_FORMATTER.format(number);
}
exports.formatCurrency = formatCurrency;
