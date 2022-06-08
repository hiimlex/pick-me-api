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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../../core/utils");
const auth_1 = require("../auth");
const products_1 = require("../products");
const users_model_1 = require("./users.model");
class UsersRepositoryClass {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_model_1.UsersModel.find({});
                if (!users) {
                    throw new NotFoundUserException();
                }
                return res.status(200).json(users);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_model_1.UsersModel.findById(req.params.id);
                if (!user) {
                    throw new NotFoundUserException();
                }
                return res.status(200).json(user);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_model_1.UsersModel.create(req.body);
                return res.status(201).json(user);
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const id = req.params.id;
                const user = yield (0, products_1.getUserByToken)(req, next);
                if (!user) {
                    throw new auth_1.UnauthorizedException();
                }
                if (id !== user.id) {
                    throw new auth_1.ForbiddenException();
                }
                yield user.updateOne(body);
                const updatedUser = yield users_model_1.UsersModel.findById(id);
                return res.status(200).json({ updatedUser });
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield (0, products_1.getUserByToken)(req, next);
                if (!user) {
                    throw new auth_1.UnauthorizedException();
                }
                if (id !== user.id) {
                    throw new auth_1.ForbiddenException();
                }
                yield products_1.ProductsModel.findOneAndRemove({
                    owner: new mongoose_1.default.Types.ObjectId(user.id),
                });
                yield user.deleteOne();
                const deletedUser = yield users_model_1.UsersModel.findById(id);
                return res.status(200).json({ deletedUser });
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
}
class NotFoundUserException extends utils_1.HttpException {
    constructor() {
        super(404, "User not found");
    }
}
const UsersRepository = new UsersRepositoryClass();
exports.UsersRepository = UsersRepository;
