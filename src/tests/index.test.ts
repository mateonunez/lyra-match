import {create, insert, search} from "@lyrasearch/lyra"
import {test} from "tap"
import {match, MatchProperty} from ".."

import type {SearchParams} from "@lyrasearch/lyra/dist/methods/search"
import type {PropertiesSchema} from "@lyrasearch/lyra/dist/types"

function removeId<T extends PropertiesSchema>(match: MatchProperty<T>): Omit<MatchProperty<T>, "id"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...rest} = match
  return rest as unknown as Omit<MatchProperty<T>, "id">
}

test("match", async ({test, plan}) => {
  plan(3)

  const lyra = await create({
    schema: {
      author: "string",
      github: "string",
      age: "number",
      has_pets: "boolean"
    }
  })
  await insert(lyra, {
    author: "mateonunez",
    github: "https://github.com/mateonunez",
    age: 27,
    has_pets: true
  })

  test("propetries should match", async ({same, end}) => {
    const params = {term: "mateonunez"} as SearchParams<typeof lyra.schema>
    const {hits} = await search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        author: "mateonunez",
        github: "https://github.com/mateonunez"
      }
    ])
    end()
  })

  test("searched props should match", async ({same, end}) => {
    const params = {term: "mateonunez", properties: ["author"]} as SearchParams<typeof lyra.schema>
    const {hits} = await search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        author: "mateonunez"
      }
    ])
    end()
  })

  test("should search correctly numbers", {skip: true}, async ({same, end}) => {
    // @ts-expect-error - skipped reason: https://github.com/LyraSearch/lyra/issues/139
    const params = {term: 27} as SearchParams<typeof lyra.schema>
    const {hits} = await search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        age: "27" // this should be a number
      }
    ])
    end()
  })
})

test("errors", async ({test, plan}) => {
  plan(2)

  const lyra = await create({
    schema: {
      author: "string",
      quote: "string"
    }
  })

  await insert(lyra, {
    author: "Oscar Wilde",
    quote: "Be yourself; everyone else is already taken."
  })

  test("properties should be retrieved event with different word cases", async ({same, end}) => {
    const params = {term: "oscar"} as SearchParams<typeof lyra.schema>
    const {hits} = await search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        author: "Oscar Wilde"
      }
    ])
    end()
  })

  test("properties should be retrieved event with different word cases", async ({same, end}) => {
    const params = {term: "EVERYONE"} as SearchParams<typeof lyra.schema>
    const {hits} = await search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        quote: "Be yourself; everyone else is already taken."
      }
    ])
    end()
  })
})
