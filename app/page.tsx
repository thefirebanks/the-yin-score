import Head from "next/head";
import NetworkVisualization from "./network/page";

const HomePage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>The Yin-Network</title>
        <meta name="description" content="Your home page description" />
      </Head>
      <NetworkVisualization />
    </div>
  );
};

export default HomePage;
