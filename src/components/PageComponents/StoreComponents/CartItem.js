"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
var react_1 = require("react");
var react_bootstrap_1 = require("react-bootstrap");
var ShoppingCartContex_tsx_1 = require("../context/ShoppingCartContex.tsx");
var items_json_1 = require("../data/items.json");
var TransportItems_json_1 = require("../data/TransportItems.json");
var formatCurrency_ts_1 = require("../utilities/formatCurrency.ts");
function CartItem(_a) {
    var id = _a.id, quantity = _a.quantity, type = _a.type;
    var removeFromCart = (0, ShoppingCartContex_tsx_1.useShoppingCart)().removeFromCart;
    var item = type === "store" ? items_json_1.default.find(function (i) { return i.id === id; }) : TransportItems_json_1.default.find(function (i) { return i.id === id; });
    if (item == null)
        return null;
    return (react_1.default.createElement(react_bootstrap_1.Stack, { direction: "horizontal", gap: 2, className: "d-flex align-items-center" },
        react_1.default.createElement("img", { src: item.imgUrl, style: { width: "125px", height: "75px", objectFit: "cover" } }),
        react_1.default.createElement("div", { className: "me-auto" },
            react_1.default.createElement("div", null,
                item.name,
                " ",
                quantity > 1 && (react_1.default.createElement("span", { className: "text-muted", style: { fontSize: ".65rem" } },
                    "x",
                    quantity))),
            react_1.default.createElement("div", { className: "text-muted", style: { fontSize: ".75rem" } }, (0, formatCurrency_ts_1.formatCurrency)(item.price))),
        react_1.default.createElement("div", null, (0, formatCurrency_ts_1.formatCurrency)(item.price * quantity)),
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", size: "sm", onClick: function () { return removeFromCart(item.id, item.type); } }, "\u00D7")));
}
exports.CartItem = CartItem;
