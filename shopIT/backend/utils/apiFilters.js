class APIFilter {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {};

        if (Object.keys(keyword).length > 0) {
            this.query = this.query.find(keyword);
        }
        return this;
    }

    filter() {
        let queryCopy = { ...this.queryStr };

        // Fields to remove from the query
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((field) => delete queryCopy[field]);

        // Convert keys like 'price[gte]' to { price: { $gte: value } }
        const allowedOps = ['gte', 'gt', 'lte', 'lt'];
        const mongoQuery = {};
        Object.keys(queryCopy).forEach(key => {
            // Check for bracket notation
            const leftBracket = key.indexOf('[');
            const rightBracket = key.indexOf(']');
            if (leftBracket !== -1 && rightBracket === key.length - 1) {
                const field = key.substring(0, leftBracket);
                const op = key.substring(leftBracket + 1, rightBracket);
                if (allowedOps.includes(op)) {
                    if (!mongoQuery[field]) mongoQuery[field] = {};
                    let value = queryCopy[key];
                    if (!isNaN(value)) value = Number(value);
                    mongoQuery[field][`$${op}`] = value;
                }
            } else {
                // Not bracket notation, just copy as is (convert to number if possible)
                let value = queryCopy[key];
                if (!isNaN(value)) value = Number(value);
                mongoQuery[key] = value;
            }
        });

        if (Object.keys(mongoQuery).length > 0) {
            this.query = this.query.find(mongoQuery);
        }
        return this;
    }
    
}

export default APIFilter;