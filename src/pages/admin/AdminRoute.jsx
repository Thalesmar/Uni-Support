const AdminRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/tickets" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
