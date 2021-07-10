// import * as documentModels from '@app/app.models';
import {Document, Model} from 'mongoose';

export class DaoManager {
    protected Model: any;
    constructor(model: Model<any>) {
        this.Model = model;
    }

    async save(data: any) {
        const result = await new this.Model(data).save();
        return result;
    }

	async create(data: any): Promise<any> {
		return await this.Model.create(data);
	}

	async count(query: any): Promise<number | boolean> {
		return !! await this.Model.countDocuments(query);
	}

    async findOne(query: any, projection: any, options: any, populateQuery: any) {
		try {
			if (!populateQuery) { // populate
				console.log('.........populate');
				return await this.Model.findOne(query, projection, options).populate(populateQuery).exec();
			} else {
				return await this.Model.findOne(query, projection, options);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async find<T extends Document>(query: any, projection: any, options: any, sort: {[key: string]: number}, paginate: {pageNo: number, limit: number}) {
		try {
            const skip = (paginate.pageNo - 1) * paginate.limit;
            if (!sort) {
                return await this.Model.find(query, projection, options).skip(skip).limit(paginate.limit);
            } else {
                return await this.Model.find(query, projection, options).skip(skip).limit(paginate.limit).sort(sort);
            }
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async findOneAndUpdate<T extends Document>(query: any, update: any, options: any) {
		try {
			return await this.Model.findOneAndUpdate(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async findById<T extends Document>(_id: string , projection: {[key: string]: 1 | 0}, options: any) {
        try {
            if (!projection) {
                return await this.Model.findById({_id}).exec();
            } else {
                return await this.Model.findById({_id}).select(projection).exec();
            }
            
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async update<T extends Document>(query: any, update: any, options: any) {
		try {
			return await this.Model.update(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateOne<T extends Document>(query: any, update: any, options: any) {
		try {
			return await this.Model.updateOne(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateMany(query: any, update: any, options: any) {
		try {
			return await this.Model.updateMany(query, update, options);
		} catch (error) {
			return Promise.reject(error);
		}
	}

    async remove(query: any) {
        try {
            return await this.Model.remove(query);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async insertOne(data: any, options: any) {
        try {
            return await this.Model.insertOne(data, options);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async insertMany(data: any[], options: any) {
        try {
            return await this.Model.insertMany(data, options);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    queryBuilder = (pipeline: Array<Object>, skip: number, limit: number, pageNo: number): Array<Object> => {
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
	}

    paginateWithNextHit = async (pipeline: Array<Object>, limit?: number, pageNo?: number) => {
		try {
			if (limit) {
				limit = Math.abs(limit);
				if (limit > 100) {
					limit = 100;
				}
			} else {
				limit = 10;
			}
			if (pageNo && (pageNo !== 0)) {
				pageNo = Math.abs(pageNo);
			} else {
				pageNo = 1;
			}

			let skip = (limit * (pageNo - 1));
			const result = await this.Model.aggregate(this.queryBuilder(pipeline, skip, limit, pageNo));
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
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

