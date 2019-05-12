/**
 * Agressive caching using node-cache
 */
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 5 * 60,
  checkperiod: 5 * 60,
  deleteOnExpire: false,
});

const defaultKeyOptions = {
  deleteOnExpire: false,
}

const lockedKeys = [];
const isLocked = (key) => lockedKeys.includes(key);
const lock = (key) => lockedKeys.push(key);
const unlock = (key) => {
  const index = lockedKeys.findIndex(k => k === key);
  if (index !== -1) {
    lockedKeys[index] = lockedKeys[lockedKeys.length - 1];
    lockedKeys.pop();
  }
}

/**
 * On expired node-cache event
 */
myCache.on("expired", function (key, value) {
  if (!isLocked(key)) {
    lock(key);

    const { func, args, options } = value;
    const { deleteOnExpire } = options;

    if (deleteOnExpire) {
      myCache.del(key);
      unlock(key);
      console.log(`KEY ${key} deleted`);
    } else {
      set(key, func, args, options).then(() => {
        console.log(`KEY ${key} updated`);
      }).catch(() => {
        console.error(`KEY ${key} couldn't be updated`);
      }).then(() => {
        unlock(key);
      });
    }
  }
});

/**
 * Update a key using its function and arguments
 * @param {*} key 
 * @param {*} func 
 * @param {*} args 
 * @param {*} options 
 */
const set = (key, func, args, options) => new Promise((resolve, reject) => {
  func.apply(this, args).then(data => {
    myCache.set(key, {
      func,
      args,
      options,
      data,
    });
    resolve(data);
  }).catch(error => {
    reject(error);
  })
});

/**
 * Agressive caching
 * Answers with data first, checks if data needs to be updated later
 * @param {*} key the key used by the cache
 * @param {*} func the function that will return the data to cache
 * @param {*} args the arguments of the function
 * @param {*} options the option for the key 
 */
const cache = (key, func, args = [], options = defaultKeyOptions) => {
  return new Promise((resolve, reject) => {
    let value = myCache.get(key);

    // value isn't already in cache
    if (value === undefined && !isLocked(key)) {
      lock(key);
      set(key, func, args, options).then(data => {
        resolve(data);
      }).catch(error => {
        // This is bad, we have nothing to give back to the user
        console.error(`KEY ${key} coun't be updated`);
        reject(error);
      }).then(() => {
        unlock(key);
      });
    } else {
      // Key found, answer to the user before checking if value
      // has expired or not
      resolve(value.data);

      // Time left
      const secondsLeft = (myCache.getTtl(key) - Date.now()) / 1000;
      console.log(`TTL ${key} ${secondsLeft} s left`);
      
      // update data if expired
      if (Date.now() > myCache.getTtl(key)) {
        console.log(`KEY ${key} expired`);
        lock(key);
        set(key, func, args, options).catch(error => {
          console.error(`KEY ${key} coun't be updated`);
        }).then(() => {
          unlock(key);
        });
      }
    }
  })
}

module.exports = cache;