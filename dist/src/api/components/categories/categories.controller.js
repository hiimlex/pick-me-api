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
exports.CategoriesController = void 0;
const controllers_1 = require("../../../core/controllers");
const auth_1 = require("../auth");
const categories_model_1 = require("./categories.model");
const categories_repository_1 = require("./categories.repository");
class CategoriesController extends controllers_1.BaseController {
    constructor() {
        super();
        this.apiPrefix = "/categories";
        this.initRoutes();
        this.generateCategories();
    }
    generateCategories() {
        const categories = [
            { name: "Art" },
            { name: "Product" },
            { name: "Service" },
        ];
        categories.forEach((item) => __awaiter(this, void 0, void 0, function* () {
            const hasCategory = yield categories_model_1.CategoriesModel.findOne({ name: item.name });
            if (!hasCategory) {
                const category = yield categories_model_1.CategoriesModel.create({ name: item.name });
                yield category.save();
            }
        }));
    }
    initRoutes() {
        this.router.get(this.apiPrefix, [], auth_1.AuthRepository.isAuthenticated, categories_repository_1.CategoriesRepository.index);
    }
}
exports.CategoriesController = CategoriesController;
