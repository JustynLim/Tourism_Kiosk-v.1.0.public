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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShoppingCart = void 0;
var react_1 = require("react");
var react_2 = require("react");
var ShoppingCart_tsx_1 = require("../PageComponents/StoreComponents/ShoppingCart.tsx");
var ShoppingCartContext = (0, react_2.createContext)({});
function useShoppingCart() {
    return (0, react_2.useContext)(ShoppingCartContext);
}
exports.useShoppingCart = useShoppingCart;
var ShoppingCartProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_2.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_2.useState)([]), cartItems = _c[0], setCartItems = _c[1];
    var cartQuantity = cartItems.reduce(function (quantity, item) { return item.quantity + quantity; }, 0);
    var openCart = function () { return setIsOpen(true); };
    var closeCart = function () { return setIsOpen(false); };
    function getItemQuantity(id, type) {
        var _a;
        return ((_a = cartItems
            .filter(function (item) { return item.type === type; })
            .find(function (item) { return item.id === id; })) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
    }
    function IncreaseCartQuantity(id, type) {
        setCartItems(function (currItems) {
            var existingItem = currItems.find(function (item) { return item.id === id && item.type === type; });
            if (!existingItem) {
                // If the item doesn't exist in the cart, add it with quantity 1
                return __spreadArray(__spreadArray([], currItems, true), [{ id: id, quantity: 1, type: type }], false);
            }
            else {
                // If the item already exists, increase its quantity
                return currItems.map(function (item) {
                    return item.id === id && item.type === type
                        ? __assign(__assign({}, item), { quantity: item.quantity + 1 }) : item;
                });
            }
        });
    }
    function DecreaseCartQuantity(id, type) {
        setCartItems(function (currItems) {
            var existingItem = currItems.find(function (item) { return item.id === id && item.type === type; });
            if (existingItem && existingItem.quantity === 1) {
                // If the item exists with quantity 1, remove it from the cart
                return currItems.filter(function (item) { return !(item.id === id && item.type === type); });
            }
            else {
                // If the item exists with quantity > 1, decrease its quantity
                return currItems.map(function (item) {
                    return item.id === id && item.type === type
                        ? __assign(__assign({}, item), { quantity: item.quantity - 1 }) : item;
                });
            }
        });
    }
    function removeFromCart(id, type) {
        setCartItems(function (currItems) {
            return currItems.filter(function (item) { return !(item.id === id && item.type === type); });
        });
    }
    return (react_1.default.createElement(ShoppingCartContext.Provider, { value: {
            getItemQuantity: getItemQuantity,
            IncreaseCartQuantity: IncreaseCartQuantity,
            DecreaseCartQuantity: DecreaseCartQuantity,
            removeFromCart: removeFromCart,
            openCart: openCart,
            closeCart: closeCart,
            cartItems: cartItems,
            cartQuantity: cartQuantity,
        } },
        children,
        react_1.default.createElement(ShoppingCart_tsx_1.default, { isOpen: isOpen })));
};
exports.default = ShoppingCartProvider;