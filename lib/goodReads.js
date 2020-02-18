// Documentation: https://www.goodreads.com/api

const parseXml = require('xml2js').parseStringPromise;
const rateLimitedCall = require('./util/rateLimit').rateLimitedCall;

class GoodReads {
    /**
     * 
     * @param {String} apiKey 
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiCall = rateLimitedCall;
    }

    /**
     * https://www.goodreads.com/api/index#search.books
     * @param {String} query 
     * @param {String} field One of: 'title', 'author', or 'all'
     * @param {Number} page 
     */
    async searchBook(query, field = 'all', page = 1) {
        const response = await this.apiCall({
            url: 'https://www.goodreads.com/search/index.xml',
            params: {
                key: this.apiKey,
                q: query,
                search: field,
                page: page,
            },
        });
        const resultXml = response.data;
        const json = await parseXml(resultXml);
        return json.GoodreadsResponse.search[0].results;
    }

    /**
     * https://www.goodreads.com/api/index#search.authors
     * @param {String} authorName 
     */
    async getAuthorByName(authorName) {
        const response = await this.apiCall({
            url: 'https://www.goodreads.com/api/author_url/' + authorName,
            params: {
                key: this.apiKey,
                id: authorName,
            },
        });
        const resultXml = response.data;
        const json = await parseXml(resultXml);
        return json.GoodreadsResponse.author;
    }
}

module.exports = GoodReads;
