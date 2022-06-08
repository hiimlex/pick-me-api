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
exports.NotFoundProductException = exports.getUserByToken = exports.ProductsRepository = void 0;
const utils_1 = require("../../../core/utils");
const auth_1 = require("../auth");
const users_1 = require("../users");
const products_model_1 = require("./products.model");
const ObjectId = require("mongoose").Types.ObjectId;
class ProdutsRepositoryClass {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                let query = {};
                if (filters && Object.keys(filters).length) {
                    if (filters.ownerId) {
                        query.owner = ObjectId(filters.ownerId);
                    }
                    if (filters.productName) {
                        query.name = { $regex: new RegExp(filters.productName + "", "gmi") };
                    }
                    if (filters.categoryId) {
                        query.category = ObjectId(filters.categoryId);
                    }
                }
                const products = yield products_model_1.ProductsModel.find(query)
                    .populate("owner", "name bio email ")
                    .populate("category", "-_id");
                return res.status(200).json(products);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.toString() });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const product = yield products_model_1.ProductsModel.findById(id)
                    .populate("owner", "name bio email ")
                    .populate("category", "-_id");
                if (!product) {
                    throw new NotFoundProductException();
                }
                return res.status(200).json(product);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.toString() });
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authenticatedUser = yield getUserByToken(req, next);
                if (!authenticatedUser) {
                    throw new auth_1.ForbiddenException();
                }
                const body = req.body;
                body.owner = authenticatedUser._id;
                const product = yield products_model_1.ProductsModel.create(body);
                const newProduct = yield products_model_1.ProductsModel.findById(product._id)
                    .populate("owner", "name bio email ")
                    .populate("category", "-_id");
                if (!newProduct) {
                    throw new NotFoundProductException();
                }
                return res.status(201).json({ createdProduct: newProduct });
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(400).json({ error: err.toString() });
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const body = req.body;
                const authenticatedUser = yield getUserByToken(req, next);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const query = {
                    _id: ObjectId(id),
                    owner: ObjectId(authenticatedUser.id),
                };
                const product = yield products_model_1.ProductsModel.findOne(query);
                if (!product) {
                    throw new auth_1.ForbiddenException();
                }
                yield product.updateOne(body);
                const updatedProduct = yield products_model_1.ProductsModel.findById(id)
                    .populate("owner", "name bio email ")
                    .populate("category", "-_id");
                if (!updatedProduct) {
                    throw new NotFoundProductException();
                }
                return res.status(200).json(updatedProduct);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.toString() });
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const authenticatedUser = yield getUserByToken(req, next);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const query = {
                    _id: ObjectId(id),
                    owner: ObjectId(authenticatedUser.id),
                };
                const product = yield products_model_1.ProductsModel.findOne(query)
                    .populate("owner", "name bio email ")
                    .populate("category", "-_id");
                if (!product) {
                    throw new auth_1.ForbiddenException();
                }
                yield product.deleteOne();
                return res.status(200).json({ deletedProduct: product });
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
function getUserByToken(req, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let token = req.headers.authorization;
            if (!token) {
                throw new auth_1.UnauthorizedException();
            }
            token = token.replace("Bearer", "").trim();
            const authenticatedUser = yield users_1.UsersModel.findByToken(token);
            if (!authenticatedUser) {
                throw new auth_1.ForbiddenException();
            }
            return authenticatedUser;
        }
        catch (err) {
            throw new auth_1.UnauthorizedException();
        }
    });
}
exports.getUserByToken = getUserByToken;
class NotFoundProductException extends utils_1.HttpException {
    constructor() {
        super(404, "Product not found");
    }
}
exports.NotFoundProductException = NotFoundProductException;
const ProductsRepository = new ProdutsRepositoryClass();
exports.ProductsRepository = ProductsRepository;
