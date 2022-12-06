const adminAccess = (resolvers) => {
    Object.keys(resolvers).forEach((k) => {
      resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
        if (!rp.context.isAdmin)
        {
          throw new Error("Unauthorized");
        }
        return next(rp)
      });
    });
    return resolvers;
}

module.exports = adminAccess;