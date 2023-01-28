import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Resin CSS</title>
      </Head>
      <a href="./hello">hello</a> <br />
      <a href="./counter">counter</a> <br />
      <a href="./zoo">zoo</a> <br />
      <a href="./counter2">rainbow counter</a> <br />
      <a href="./styled">styled</a>
    </>
  );
}
