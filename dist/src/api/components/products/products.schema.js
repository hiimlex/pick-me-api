"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsSchema = void 0;
const mongoose_1 = require("mongoose");
const ProductsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: { type: Number, required: true },
    quantity: {
        type: Number,
    },
    image: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Categories" },
    owner: {
        ref: "Users",
        type: mongoose_1.Schema.Types.ObjectId,
    },
}, {
    versionKey: false,
    collection: "Products",
    timestamps: { createdAt: true, updatedAt: true },
});
exports.ProductsSchema = ProductsSchema;
ProductsSchema.methods.toJSON = function () {
    const product = this;
    const _a = product.toObject(), { _id, category } = _a, rest = __rest(_a, ["_id", "category"]);
    let categoryName = "";
    if (category && category.name) {
        categoryName = category.name;
    }
    return Object.assign({ id: _id.toString(), categoryName }, rest);
};
