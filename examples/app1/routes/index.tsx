import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <a href="./hello">hello</a> <br />
      <a href="./counter">counter</a> <br />
      <a href="./zoo">zoo</a>
    </>
  );
}
