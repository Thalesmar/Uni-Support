const ProtectedRoute = ({
  user,
  allowedRoles = [],
  fallback = null,
  unauthorizedFallback = null,
  children,
}) => {
  if (!user) {
    return fallback;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return unauthorizedFallback || fallback;
  }

  return children;
};

export default ProtectedRoute;
