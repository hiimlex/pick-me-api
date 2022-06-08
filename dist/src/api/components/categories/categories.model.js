"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModel = void 0;
const mongoose_1 = require("mongoose");
const categories_schema_1 = require("./categories.schema");
const CategoriesModel = (0, mongoose_1.model)("Categories", categories_schema_1.CategoriesSchema);
exports.CategoriesModel = CategoriesModel;
