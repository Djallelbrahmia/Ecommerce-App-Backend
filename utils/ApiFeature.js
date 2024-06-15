class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryStr = JSON.stringify(this.queryString);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const regex = new RegExp(this.queryString.keyword, "i");
      if (modelName === "Products") {
        this.query = this.query.find({
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
          ],
        });
      } else {
        this.query = this.query.find({
          $or: [{ name: { $regex: regex } }],
        });
      }
    }
    return this;
  }

  paginate(countDocuments) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) pagination.nextPage = page + 1;
    if (skip > 0) pagination.previousPage = page - 1;
    this.query = this.query.skip(skip).limit(limit);
    this.paginationResults = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
