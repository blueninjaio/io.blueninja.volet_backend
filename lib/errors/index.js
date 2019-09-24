module.exports =  {
  BadRequestError: require('./route/bad-request'),
  ConflictError: require('./route/conflict'),
  ForbiddenError: require('./route/forbidden'),
  RouteError: require('./route/route-error'),
  UnauthorizedError: require('./route/unauthorized')
};
