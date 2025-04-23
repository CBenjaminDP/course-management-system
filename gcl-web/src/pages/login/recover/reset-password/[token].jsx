import ResetPassword from "@/components/RecoveryPassword/ResetPassword";
export async function getServerSideProps(context) {
  const { token } = context.params;

  return {
    props: { token },
  };
}

export default function ResetPasswordPage({ token }) {
  return <ResetPassword token={token} />;
}
