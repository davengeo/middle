var badRequest = function(res, reason) {
    res.status(400)
        .json({ message: 'request not accepted', reason: 'reason'})
        .end();
};

var noAccess = function(res, reason) {
    res.status(401)
        .json({ message: 'no access', reason: reason })
        .end();
};

var serverError = function(res, err) {
    res.status(501)
        .json({ message: 'server error', reason: err.message })
        .end();
};

module.exports = {
    badRequest: badRequest,
    noAccess: noAccess,
    serverError: serverError
};
