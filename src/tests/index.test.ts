import {create, insert, search} from "@lyrasearch/lyra"
import {test} from "tap"
import {match} from ".."

test("test", ({plan, same}) => {
  plan(1)
  same(1, 1)
})

test("match", ({test, plan}) => {
  plan(1)
  test("propetries should match", ({same, end}) => {
    const lyra = create({
      schema: {
        author: "string",
        github: "string"
      }
    })

    insert(lyra, {
      author: "mateonunez",
      github: "https://github.com/mateonunez"
    })

    const params = {term: "mateonunez"}
    const results = search(lyra, params)

    const matches = match(lyra, params, results)
    same(matches, {author: "mateonunez"})
    end()
  })
})
