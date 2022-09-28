import {Lyra, PropertiesSchema, RetrievedDoc, SearchParams} from "@lyrasearch/lyra"
import type {ResolveSchema, SearchProperties} from "@lyrasearch/lyra/dist/esm/src/types"

export type MatchProperties<T extends PropertiesSchema> = ResolveSchema<T>[]

export function match<T extends PropertiesSchema>(lyra: Lyra<T>, params: SearchParams<T>, hits: RetrievedDoc<T>[]): MatchProperties<T> {
  const properties = (!params.properties || params.properties === "*" ? [] : params.properties) as SearchProperties<T>[]
  const {term} = params
  const matches = [] as MatchProperties<T>
  for (const hit of hits) {
    const props = properties.length > 0 ? properties : Object.keys(hit)
    const matchedProps = createMatchesObject(hit, term, props as [])
    matches.push(matchedProps as ResolveSchema<T>)
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: RetrievedDoc<T>, term: string, properties: []): {[key: string]: string} {
  const matchedProps = {} as any
  for (const property of properties) {
    const value = hit[property]
    if (typeof value === "string" && value.includes(term)) {
      matchedProps[property] = value
    }
  }
  return matchedProps
}
