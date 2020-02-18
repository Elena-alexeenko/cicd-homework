const assert = require('assert');
const rateLimitUtil = require('./rateLimit');

describe('rateLimitedCall', () => {
    it('Calls axios', done => {
        rateLimitUtil.rateLimitedCall(null, () => {
            done();
        });
    });

    it('Uses the passed options', done => {
        const options = {foo: 'bar'};
        rateLimitUtil.rateLimitedCall(options, (receivedOptions) => {
            assert.strictEqual(receivedOptions, options);
            done();
        });
    });

    it('Resolves with what\'s returned from axios', async () => {
        const dataToReturn = {};
        const returnedData = await rateLimitUtil.rateLimitedCall(null, () => {
            return Promise.resolve(dataToReturn);
        });
        assert.strictEqual(returnedData, dataToReturn);
    });

    it('Calls the same method not earlier than 1 second after last', async function () {
        this.timeout(5000); // eslint-disable-line no-invalid-this
        let lastCallTime = null;

        function axiosMockCall() {
            if (lastCallTime === null) {
                lastCallTime = Date.now();
            } else {
                assert.ok(Date.now() - lastCallTime >= 1000, 'Calls aren\'t a second a part');
            }
            return Promise.resolve();
        }

        await Promise.all([
            rateLimitUtil.rateLimitedCall({url: 'foobar'}, axiosMockCall),
            rateLimitUtil.rateLimitedCall({url: 'foobar'}, axiosMockCall),
        ]);
    });
});
