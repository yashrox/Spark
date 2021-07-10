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
class DaoManager {
    constructor(model) {
        this.queryBuilder = (pipeline, skip, limit, pageNo) => {
            let query = pipeline || [];
            query.push({
                "$facet": {
                    data: [
                        { "$skip": skip },
                        { "$limit": limit }
                    ],
                    metadata: [
                        { "$count": "total" },
                        { "$addFields": { page: pageNo } }
                    ]
                }
            });
            return query;
        };
        this.paginateWithNextHit = (pipeline, limit, pageNo) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (limit) {
                    limit = Math.abs(limit);
                    if (limit > 100) {
                        limit = 100;
                    }
                }
                else {
                    limit = 10;
                }
                if (pageNo && (pageNo !== 0)) {
                    pageNo = Math.abs(pageNo);
                }
                else {
                    pageNo = 1;
                }
                let skip = (limit * (pageNo - 1));
                const result = yield this.Model.aggregate(this.queryBuilder(pipeline, skip, limit, pageNo));
                let next_hit = 0;
                let total_page = (result[0]["data"].length > 0) ? Math.ceil(result[0].metadata[0].total / limit) : 0;
                if (result[0]["data"].length > limit) {
                    result[0]["data"].pop();
                }
                if (total_page > pageNo) {
                    next_hit = pageNo + 1;
                }
                return {
                    "total": result[0]["metadata"] && result[0]["metadata"][0] ? result[0]["metadata"][0]["total"] : 0,
                    "pageNo": result[0]["metadata"] && result[0]["metadata"][0] ? result[0]["metadata"][0]["page"] : pageNo,
                    "totalPage": total_page,
                    "nextHit": next_hit,
                    "limit": limit,
                    "data": result[0]["data"],
                    "filterCount": result[0]["data"].length
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
        this.Model = model;
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new this.Model(data).save();
            return result;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Model.create(data);
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.Model.countDocuments(query));
        });
    }
    findOne(query, projection, options, populateQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!populateQuery) { // populate
                    console.log('.........populate');
                    return yield this.Model.findOne(query, projection, options).populate(populateQuery).exec();
                }
                else {
                    return yield this.Model.findOne(query, projection, options);
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    find(query, projection, options, sort, paginate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (paginate.pageNo - 1) * paginate.limit;
                if (!sort) {
                    return yield this.Model.find(query, projection, options).skip(skip).limit(paginate.limit);
                }
                else {
                    return yield this.Model.find(query, projection, options).skip(skip).limit(paginate.limit).sort(sort);
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    findOneAndUpdate(query, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.findOneAndUpdate(query, update, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    findById(_id, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!projection) {
                    return yield this.Model.findById({ _id }).exec();
                }
                else {
                    return yield this.Model.findById({ _id }).select(projection).exec();
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    update(query, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.update(query, update, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateOne(query, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.updateOne(query, update, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateMany(query, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.updateMany(query, update, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    remove(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.remove(query);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    insertOne(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.insertOne(data, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    insertMany(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.insertMany(data, options);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.DaoManager = DaoManager;
