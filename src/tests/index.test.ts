import {create, insert, search, SearchParams} from "@lyrasearch/lyra"
import {test} from "tap"
import {match} from ".."

test("test", ({plan, same}) => {
  plan(1)
  same(1, 1)
})

test("match", ({test, plan}) => {
  plan(2)

  const lyra = create({
    schema: {
      author: "string",
      github: "string",
      age: "number",
      has_pets: "boolean"
    }
  })

  insert(lyra, {
    author: "mateonunez",
    github: "https://github.com/mateonunez",
    age: 27,
    has_pets: true
  })

  test("propetries should match", ({same, end}) => {
    const params = {term: "mateonunez"} as SearchParams<typeof lyra.schema>
    const {hits} = search(lyra, params)
    const matches = match(lyra, params, hits)

    same(matches, [
      {
        author: "mateonunez",
        github: "https://github.com/mateonunez"
      }
    ])
    end()
  })

  test("searched props should match", ({same, end}) => {
    const params = {term: "mateonunez", properties: ["author"]} as SearchParams<typeof lyra.schema>
    const {hits} = search(lyra, params)
    const matches = match(lyra, params, hits)

    same(matches, [
      {
        author: "mateonunez"
      }
    ])
    end()
  })
})
