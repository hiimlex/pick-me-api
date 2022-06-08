"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModel = void 0;
const mongoose_1 = require("mongoose");
const products_schema_1 = require("./products.schema");
const ProductsModel = (0, mongoose_1.model)("Products", products_schema_1.ProductsSchema);
exports.ProductsModel = ProductsModel;
