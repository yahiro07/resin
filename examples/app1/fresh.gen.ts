// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_app from "./routes/_app.tsx";
import * as $counter from "./routes/counter.tsx";
import * as $counter2 from "./routes/counter2.tsx";
import * as $hello from "./routes/hello.tsx";
import * as $index from "./routes/index.tsx";
import * as $styled from "./routes/styled.tsx";
import * as $zoo from "./routes/zoo.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Counter2 from "./islands/Counter2.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_app.tsx": $_app,
    "./routes/counter.tsx": $counter,
    "./routes/counter2.tsx": $counter2,
    "./routes/hello.tsx": $hello,
    "./routes/index.tsx": $index,
    "./routes/styled.tsx": $styled,
    "./routes/zoo.tsx": $zoo,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/Counter2.tsx": $Counter2,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
