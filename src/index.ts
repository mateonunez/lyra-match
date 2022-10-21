import {PropertiesSchema, RetrievedDoc, SearchParams, tokenize} from "@lyrasearch/lyra"
import type {ResolveSchema} from "@lyrasearch/lyra/dist/esm/src/types"

type ExpectedType = string | number | boolean
export type MatchProperty<T extends PropertiesSchema> = {id: string} & ResolveSchema<T>

export function match<T extends PropertiesSchema>(hits: RetrievedDoc<T>[], params: SearchParams<T>): MatchProperty<T>[] {
  if (hits.length === 0) return []
  const properties = !params.properties || params.properties === "*" ? [] : params.properties
  const props = (properties.length > 0 ? properties : Object.keys(hits[0])) as []
  const terms = tokenize(params.term)
  const matches = [] as unknown as MatchProperty<T>[]
  for (const hit of hits) {
    const matchedProps = createMatchesObject(hit, terms, props)
    if (Object.keys(matchedProps).length > 0) {
      matches.push(matchedProps)
    }
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: RetrievedDoc<T>, terms: ExpectedType[], properties: string[]): MatchProperty<T> {
  const matchedProps = {} as MatchProperty<T>
  for (const property of properties) {
    const value = hit[property] as ExpectedType
    if (checkValue(value, terms)) {
      matchedProps["id"] = hit.id
      // @ts-expect-error - it's a valid property
      matchedProps[property] = value
    }
  }
  return matchedProps
}

function checkValue(value: ExpectedType, terms: ExpectedType[]): boolean {
  for (const term of terms) {
    if (typeof value === "string") {
      if (value.toLowerCase().includes(term.toString().toLowerCase())) {
        return true
      }
    } else if (value === term) {
      return true
    }
  }
  return false
}
