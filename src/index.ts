import {PropertiesSchema, RetrievedDoc, SearchParams} from "@lyrasearch/lyra"
import type {SearchProperties} from "@lyrasearch/lyra/dist/esm/src/types"

export type MatchProperty = {id: string} & {[key: string]: string | number | boolean}
export type MatchProperties = MatchProperty[]

export function match<T extends PropertiesSchema>(hits: RetrievedDoc<T>[], params: SearchParams<T>): MatchProperties {
  const properties = (!params.properties || params.properties === "*" ? [] : params.properties) as SearchProperties<T>[]
  const {term} = params
  const matches = [] as unknown as MatchProperties
  for (const hit of hits) {
    const props = (properties.length > 0 ? properties : Object.keys(hit)) as []
    const matchedProps = createMatchesObject(hit, term, props)
    matches.push(matchedProps)
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: RetrievedDoc<T>, term: string | number | boolean, properties: string[]): MatchProperty {
  const matchedProps = {} as MatchProperty
  for (const property of properties) {
    const value = hit[property] as string | number | boolean
    if (checkValue(value, term)) {
      matchedProps["id"] = hit.id
      matchedProps[property] = value
    }
  }
  return matchedProps
}

function checkValue(value: string | number | boolean, term: string | number | boolean): boolean {
  if (typeof value === "string") {
    return value.toLowerCase().includes(term.toString().toLowerCase())
  }
  return value === term
}
