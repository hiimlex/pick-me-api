"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ForbiddenException = exports.UnauthorizedException = exports.AuthRepository = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const utils_1 = require("../../../core/utils");
const users_1 = require("../users");
class AuthRepositoryClass {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield users_1.UsersModel.findByCredentials(email, password);
                if (!user) {
                    throw new UnauthorizedException();
                }
                const token = yield user.generateAuthToken();
                if (!token) {
                    return res.status(500).json({ error: "Failed to generate token" });
                }
                return res.status(200).json({ accessToken: token });
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: err.toString() });
            }
        });
    }
    currentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.header("Authorization");
                if (!token) {
                    throw new ForbiddenException();
                }
                token = token.replace("Bearer", "").trim();
                const user = yield users_1.UsersModel.findOne({
                    accessToken: token,
                });
                if (!user) {
                    throw new UnauthorizedException();
                }
                return res.status(200).json(Object.assign(Object.assign({}, user.toJSON()), { token }));
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: "Failed to get the current user" });
            }
        });
    }
    isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.authorization;
                if (!token) {
                    throw new ForbiddenException();
                }
                token = token.replace("Bearer", "").trim();
                let decoded = jwt.verify(token, users_1.TOKEN_SECRET);
                const user = yield users_1.UsersModel.findOne({
                    id: decoded._id,
                    accessToken: token,
                });
                if (!user) {
                    throw new UnauthorizedException();
                }
                next();
            }
            catch (err) {
                if (err instanceof utils_1.HttpException) {
                    return res.status(err.status).json({ error: err.message });
                }
                return res.status(500).json({ error: "Failed to authenticate the user" });
            }
        });
    }
}
class UnauthorizedException extends utils_1.HttpException {
    constructor() {
        super(401, "Invalid Token");
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends utils_1.HttpException {
    constructor() {
        super(403, "Forbidden Access");
    }
}
exports.ForbiddenException = ForbiddenException;
const AuthRepository = new AuthRepositoryClass();
exports.AuthRepository = AuthRepository;
