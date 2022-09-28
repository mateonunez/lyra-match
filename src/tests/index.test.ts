import {create, insert, PropertiesSchema, search, SearchParams} from "@lyrasearch/lyra"
import {test} from "tap"
import {match, MatchProperties, MatchProperty} from ".."

function removeId<T extends PropertiesSchema>(match: MatchProperty<T>): Omit<MatchProperties<T>, "id"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...rest} = match
  return rest as unknown as Omit<MatchProperties<T>, "id">
}

test("match", ({test, plan}) => {
  plan(3)

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
    const matches = match(hits, params).map(removeId)

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
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        author: "mateonunez"
      }
    ])
    end()
  })

  test("should search correctly numbers", {skip: true}, ({same, end}) => {
    // @ts-expect-error - skipped reason: https://github.com/LyraSearch/lyra/issues/139
    const params = {term: 27} as SearchParams<typeof lyra.schema>
    const {hits} = search(lyra, params)
    const matches = match(hits, params).map(removeId)

    same(matches, [
      {
        age: "27" // this should be a number
      }
    ])
    end()
  })
})
