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
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const APIFeatures = require('../utils/apiFeatures');
const deleteOne = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new appError_1.default(404, 'fail', 'No document found with that id'));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOne = deleteOne;
const updateOne = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new appError_1.default(404, 'fail', 'No document found with that id'));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOne = updateOne;
const createOne = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createOne = createOne;
const getOne = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Model.findById(req.params.id);
        if (!doc) {
            return next(new appError_1.default(404, 'fail', 'No document found with that id'));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOne = getOne;
const getAll = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const features = new APIFeatures(Model.find(), req.query)
            .sort()
            .paginate();
        const doc = yield features.query;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAll = getAll;
