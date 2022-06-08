"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesRepository = void 0;
const utils_1 = require("../../../core/utils");
const categories_model_1 = require("./categories.model");
class CategoriesRepositoryClass {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categories_model_1.CategoriesModel.find({});
                if (!categories) {
                    throw new NotFoundCategoryException();
                }
                return res.status(200).json(categories);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.toString() });
            }
        });
    }
}
class NotFoundCategoryException extends utils_1.HttpException {
    constructor() {
        super(404, "Category not found");
    }
}
const CategoriesRepository = new CategoriesRepositoryClass();
exports.CategoriesRepository = CategoriesRepository;
