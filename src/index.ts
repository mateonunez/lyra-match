import {PropertiesSchema, RetrievedDoc, SearchParams} from "@lyrasearch/lyra"
import type {ResolveSchema, SearchProperties} from "@lyrasearch/lyra/dist/esm/src/types"

export type MatchProperty<T extends PropertiesSchema> = ResolveSchema<T> & {id: string}
export type MatchProperties<T extends PropertiesSchema> = MatchProperty<T>[]

export function match<T extends PropertiesSchema>(hits: RetrievedDoc<T>[], params: SearchParams<T>): MatchProperties<T> {
  const properties = (!params.properties || params.properties === "*" ? [] : params.properties) as SearchProperties<T>[]
  const {term} = params
  const matches = [] as unknown as MatchProperties<T>
  for (const hit of hits) {
    const props = (properties.length > 0 ? properties : Object.keys(hit)) as []
    const matchedProps = createMatchesObject(hit, term, props)
    matches.push(matchedProps)
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: RetrievedDoc<T>, term: string | number | boolean, properties: []): MatchProperty<T> {
  const matchedProps = {} as any
  for (const property of properties) {
    const value = hit[property]
    matchedProps["id"] = hit.id
    if (checkValue(value, term)) matchedProps[property] = value
  }
  return matchedProps
}

function checkValue(value: any, term: string | number | boolean): boolean {
  return (typeof value === "string" && (value as string).includes(term as string)) || ((typeof value === "number" || typeof value === "boolean") && value === term)
}
