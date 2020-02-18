const axios = require('axios');

const queue = [];
let interval = null;

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

function rateLimitedCall(axiosOptions, axiosObject = axios) {
    if (!interval) {
        interval = setInterval(() => {
            if (queue.length > 0) {
                const top = queue.shift();
                const maybePromise = top.axiosObject(top.axiosOptions);
                if (typeof (maybePromise && maybePromise.then) === 'function') {
                    maybePromise
                        .then(data => {
                            top.deferred.resolve(data);
                        })
                        .catch(err => {
                            top.deferred.reject(err);
                        });
                }
            }
        }, 1100);

        return axiosObject(axiosOptions);
    } else {
        const deferred = new Deferred();
        queue.push({
            axiosOptions: axiosOptions,
            axiosObject: axiosObject,
            deferred: deferred,
        });
        return deferred.promise;
    }
}

module.exports = {
    rateLimitedCall,
};
