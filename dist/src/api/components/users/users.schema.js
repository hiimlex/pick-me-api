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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.TOKEN_SECRET = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const auth_1 = require("../auth");
const bcryptjs_1 = require("bcryptjs");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
exports.TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [isEmail_1.default, "Invalid email"],
    },
    accessToken: {
        type: String,
    },
}, {
    versionKey: false,
    collection: "Users",
    timestamps: { createdAt: true, updatedAt: true },
});
exports.UserSchema = UserSchema;
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = (0, bcryptjs_1.hashSync)(user.password, 12);
        }
        next();
    });
});
UserSchema.methods.toJSON = function () {
    const user = this;
    const _a = user.toObject(), { _id, password, accessToken } = _a, rest = __rest(_a, ["_id", "password", "accessToken"]);
    return Object.assign({ id: _id.toString() }, rest);
};
UserSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jwt.sign({ _id: user._id }, exports.TOKEN_SECRET, { expiresIn: "8h" });
        user.accessToken = token;
        yield user.save();
        return token;
    });
};
UserSchema.statics.findByToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        const UsersModel = this;
        let decoded;
        try {
            decoded = jwt.verify(token, exports.TOKEN_SECRET);
        }
        catch (_a) {
            throw new auth_1.ForbiddenException();
        }
        const user = yield UsersModel.findOne({
            _id: decoded._id,
            accessToken: token,
        });
        if (!user) {
            return Promise.reject("Token expired");
        }
        return user;
    });
};
UserSchema.statics.findByCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let User = this;
        const user = yield User.findOne({ email });
        if (!user) {
            return Promise.reject("Invalid login credentials");
        }
        if (!(0, bcryptjs_1.compareSync)(password, user.password)) {
            return Promise.reject("Wrong password");
        }
        return user;
    });
};
