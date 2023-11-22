"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_bootstrap_1 = require("react-bootstrap");
var ShoppingCartContex_tsx_1 = require("../context/ShoppingCartContex.tsx");
var CartItem_tsx_1 = require("./CartItem.tsx");
var formatCurrency_ts_1 = require("../utilities/formatCurrency.ts");
var items_json_1 = require("../data/items.json");
var TransportItems_json_1 = require("../data/TransportItems.json");
var react_router_dom_1 = require("react-router-dom");
var ShoppingCart = function (_a) {
    var isOpen = _a.isOpen;
    var _b = (0, ShoppingCartContex_tsx_1.useShoppingCart)(), closeCart = _b.closeCart, cartItems = _b.cartItems;
    var storeTotal = cartItems
        .filter(function (item) { return item.type === "store"; }) // Filter store items
        .reduce(function (total, cartItem) {
        var item = items_json_1.default.find(function (i) { return i.id === cartItem.id; });
        return total + ((item === null || item === void 0 ? void 0 : item.price) || 0) * cartItem.quantity;
    }, 0);
    var transportTotal = cartItems
        .filter(function (item) { return item.type === "transport"; }) // Filter transport tickets
        .reduce(function (total, cartItem) {
        var item = TransportItems_json_1.default.find(function (i) { return i.id === cartItem.id; });
        return total + ((item === null || item === void 0 ? void 0 : item.price) || 0) * cartItem.quantity;
    }, 0);
    var total = storeTotal + transportTotal;
    return (react_1.default.createElement(react_bootstrap_1.Offcanvas, { show: isOpen, onHide: closeCart, placement: "end" },
        react_1.default.createElement(react_bootstrap_1.Offcanvas.Header, { closeButton: true },
            react_1.default.createElement(react_bootstrap_1.Offcanvas.Title, null, "Cart")),
        react_1.default.createElement(react_bootstrap_1.Offcanvas.Body, null,
            react_1.default.createElement(react_bootstrap_1.Stack, { gap: 3 },
                cartItems.map(function (item) { return (react_1.default.createElement(CartItem_tsx_1.CartItem, __assign({ key: item.id }, item))); }),
                react_1.default.createElement("div", { className: "ms-auto fw-bold fs-5" },
                    "Total ",
                    (0, formatCurrency_ts_1.formatCurrency)(total))),
            react_1.default.createElement(react_router_dom_1.Link, { to: "/checkout", onClick: closeCart },
                react_1.default.createElement("button", null, "Checkout")))));
};
exports.default = ShoppingCart;
