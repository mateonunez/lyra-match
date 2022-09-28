# ✏️ Match

Show which properties matches with your [Lyra](https://github.com/lyrasearch/lyra) search.


[![Tests](https://github.com/mateonunez/lyra-match/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/lyra-match/actions/workflows/ci.yml)

## Installation

You can install Lyra using `npm`, `yarn`, `pnpm`:

```sh
npm i @mateonunez/lyra-match
```
```sh
yarn add @mateonunez/lyra-match
```
```sh
pnpm add @mateonunez/lyra-match
```

## Usage

```js
import { create, insert, search } from "@lyrasearch/lyra"
import { match } from "@mateonunez/lyra-match"

(() => {
  const lyra = create({
    schema: {
      author: "string",
      website: "string",
      contributors: "number",
      stars: "number",
      forks: "number",
      language: "string"
    }
  })

  insert(lyra, {
    author: "Lyra",
    website: "https://github.com/LyraSearch",
    contributors: 21,
    stars: 3350,
    forks: 62,
    language: "TypeScript"
  })

  const properties = { term: "Lyra" }
  const { hits } = search(lyra, properties)
  const matches = match(hits, properties)

  console.log({ matches })
})();
```

**Results**
```js
{
  matches: [
    {
      id: '57941602-6',
      author: 'Lyra',
      website: 'https://github.com/LyraSearch'
    }
  ]
}
```

# License

[MIT](/LICENSE)
