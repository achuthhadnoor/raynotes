import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import List from "../components/List";
import { User } from "../interfaces";
import { findAll } from "../utils/sample-api";

type Props = {
  items: User[];
  pathname: string;
};

const WithInitialProps = ({ items }: Props) => {
  const router = useRouter();
  return (
    <Layout title="Today's tasks">
      <h1>List Example (as Function Component)</h1>
      <p>You are currently on: {router.pathname}</p>
      <List items={items} />
      <p>
        <Link href="/" className="p-2 bg-pink-500">
          Go home
        </Link>
      </p>
    </Layout>
  );
};

export async function getStaticProps() {
  const items: User[] = await findAll();

  return { props: { items } };
}

export default WithInitialProps;
