export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/mission',
      permanent: false,
    },
  };
}

export default function WhyUsRedirectPage() {
  return null;
}
