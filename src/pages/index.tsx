import { allowedRoles, getAuthCredentials, hasAccess, isAuthenticated } from "@/utils/auth";
import { GetServerSideProps } from "next";
import { Routes } from "@/utils/routes";

export default function Home() {

  return (
   <div>Dashboard</div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx);
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: Routes.login,
        permanent: false,
      },
    };
  }
  return {
    props: {
      userPermissions: permissions,
    },
  };
};