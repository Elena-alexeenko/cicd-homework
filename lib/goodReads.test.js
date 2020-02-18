const assert = require('assert');
const dotEnv = require('dotenv');
const GoodReadsApi = require('./goodReads');

dotEnv.config();

describe('searchBook', () => {
    it('Works with mock', async () => {
        const goodReads = new GoodReadsApi();
        goodReads.apiCall = () => {
            return Promise.resolve({data: `
<GoodreadsResponse>
    <search>
        <results>
            <work>
                <id type="integer">24</id>
                <best_book>
                    <title>foo</title>
                    <author>
                        <id type="integer">42</id>
                        <name>foobar</name>
                    </author>
                </best_book>
            </work>
            <work>
                <id type="integer">240</id>
                <best_book>
                    <title>foo2</title>
                    <author>
                        <id type="integer">420</id>
                        <name>foobar2</name>
                    </author>
                </best_book>
            </work>
        </results>
    </search>
</GoodreadsResponse>
`});
        };
        const result = await goodReads.searchBook('foo');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('foo2');
        });
        assert.strictEqual(result[0].work.length, 2);
        assert.strictEqual(match.id[0]._, '240');
        assert.strictEqual(match.best_book[0].title[0], 'foo2');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'foobar2');
    });

    it('Fantastic Beasts and Where to Find Them', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.searchBook('Beasts');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('Fantastic Beasts and Where to Find Them');
        });

        assert.strictEqual(match.id[0]._, '4195128');
        assert.strictEqual(match.best_book[0].title[0], 'Fantastic Beasts and Where to Find Them (Hogwarts Library)');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'Newt Scamander');
    });

    it('How to Survive a Horror Movie', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.searchBook('How to Survive a Horror Movie');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('How to Survive a Horror Movie');
        });

        assert.strictEqual(match.id[0]._, '284505');
        assert.strictEqual(match.best_book[0].title[0], 'How to Survive a Horror Movie (How to Survive)');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'Seth Grahame-Smith');
    });

    it('The Elegant Universe', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.searchBook('The Elegant Universe');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('The Elegant Universe');
        });

        assert.strictEqual(match.id[0]._, '907243');
        assert.strictEqual(match.best_book[0].title[0], 'The Elegant Universe: Superstrings, Hidden Dimensions, and the Quest for the Ultimate Theory');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'Brian Greene');
    });

    it('Hitchhiker\'s Guide', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.searchBook('Hitchhiker\'s Guide');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('Hitchhiker\'s Guide');
        });

        assert.strictEqual(match.id[0]._, '3078186');
        assert.strictEqual(match.best_book[0].title[0], 'The Hitchhiker\'s Guide to the Galaxy (Hitchhiker\'s Guide to the Galaxy, #1)');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'Douglas Adams');
    });

    it('Slaughterhouse-Five', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.searchBook('Slaughterhouse-Five');
        const match = result[0].work.find(el => {
            return el.best_book[0].title[0].includes('Slaughterhouse-Five');
        });

        assert.strictEqual(match.id[0]._, '1683562');
        assert.strictEqual(match.best_book[0].title[0], 'Slaughterhouse-Five');
        assert.strictEqual(match.best_book[0].author[0].name[0], 'Kurt Vonnegut Jr.');
    });
});

describe('getAuthorByName', () => {
    it('Works with mock', async () => {
        const goodReads = new GoodReadsApi();
        goodReads.apiCall = () => {
            return Promise.resolve({data: `
<GoodreadsResponse>
    <author id="42">
        <name>foo</name>
        <link>bar</link>
    </author>
</GoodreadsResponse>
`});
        };
        const result = await goodReads.getAuthorByName('foo');
        assert.strictEqual(result[0].$.id, '42');
        assert.strictEqual(result[0].name[0], 'foo');
        assert.strictEqual(result[0].link[0], 'bar');
    });

    it('Throws if not found', done => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        goodReads.getAuthorByName('')
            .then(() => {
                done(new Error('Expected rejection'));
            })
            .catch(() => {
                done();
            });
    });

    it('Tolkien\'s ID is 656983', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.getAuthorByName('Tolkien');
        assert.strictEqual(result[0].$.id, '656983');
    });

    it('Glen Cook\'s ID is 13026', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.getAuthorByName('Glen Cook');
        assert.strictEqual(result[0].$.id, '13026');
    });

    it('George Martin is George R.R. Martin', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.getAuthorByName('George Martin');
        assert.strictEqual(result[0].name[0], 'George R.R. Martin');
    });

    it('Anonymous has a link', async () => {
        const goodReads = new GoodReadsApi(process.env.GOODREADS_KEY);
        const result = await goodReads.getAuthorByName('Anonymous');
        assert.ok(result[0].link);
        assert.notStrictEqual(result[0].link[0].length, 0);
    });
});
