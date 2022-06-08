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
exports.CategoriesSchema = void 0;
const mongoose_1 = require("mongoose");
const CategoriesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    collection: "Categories",
});
exports.CategoriesSchema = CategoriesSchema;
CategoriesSchema.methods.toJson = function () {
    const category = this;
    const _a = category.toObject(), { _id } = _a, rest = __rest(_a, ["_id"]);
    return Object.assign({ id: _id.toString() }, rest);
};
