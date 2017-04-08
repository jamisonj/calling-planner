module.exports = function (dbPromise) {
    const ctrl = {};
    const collectionPromise = dbPromise
        .then(db => db.collection('users'));

    ctrl.findByUsername = function(username) {
        return collectionPromise
            .then(collection => {
                return collection
                    .find({ username: username })
                    .limit(1)
                    .toArray();
            })
            .then(array => array[0]);
    }

    ctrl.newUser = function(username, password, email) {
        return collectionPromise
            .then(collection => {
                return collection
                    .insertOne(
                        {
                            username: username,
                            password: password,
                            email: email,
                        }, 
                        function(err, r) {})
            }
    }

    return ctrl;
}