"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CollectionsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const CollectionsModel = (0, mongoose_1.model)("Collections", CollectionsSchema);
exports.default = CollectionsModel;
//# sourceMappingURL=CollectionModels.js.map