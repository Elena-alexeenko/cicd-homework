// Documentation: https://www.goodreads.com/api

class GoodReads {
    /**
     * 
     * @param {String} apiKey 
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * https://www.goodreads.com/api/index#search.books
     * @param {String} query 
     * @param {String} field One of: 'title', 'author', or 'all'
     * @param {Number} page 
     */
    async searchBook(query, field = 'all', page = 1) {
        // TODO
    }

    /**
     * https://www.goodreads.com/api/index#search.authors
     * @param {String} authorName 
     */
    async getAuthorByName(authorName) {
        // TODO
    }
}

module.exports = GoodReads;
