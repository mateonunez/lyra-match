import {Lyra, PropertiesSchema, SearchParams, SearchResult} from "@lyrasearch/lyra"

export type MatchProperties<T> = {
  [P in keyof T]?: T[P]
}

export function match<T extends PropertiesSchema>(lyra: Lyra<T>, params: SearchParams<T>, results: SearchResult<T>): MatchProperties<T> {
  console.log({lyra, params, results})

  return {}
}
