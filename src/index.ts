import type {PropertiesSchema, RetrievedDoc, SearchParams} from "@lyrasearch/lyra"
import type {ResolveSchema} from "@lyrasearch/lyra/dist/esm/src/types"

type ExpectedType = string | number | boolean
export type MatchProperty<T extends PropertiesSchema> = {id: string} & ResolveSchema<T>

export function match<T extends PropertiesSchema>(hits: RetrievedDoc<T>[], params: SearchParams<T>): MatchProperty<T>[] {
  if (hits.length === 0) return []
  const properties = !params.properties || params.properties === "*" ? [] : params.properties
  const props = (properties.length > 0 ? properties : Object.keys(hits[0])) as []
  const {term} = params
  const matches = [] as unknown as MatchProperty<T>[]
  for (const hit of hits) {
    const matchedProps = createMatchesObject(hit, term, props)
    matches.push(matchedProps)
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: RetrievedDoc<T>, term: ExpectedType, properties: string[]): MatchProperty<T> {
  const matchedProps = {} as MatchProperty<T>
  for (const property of properties) {
    const value = hit[property] as ExpectedType
    if (checkValue(value, term)) {
      matchedProps["id"] = hit.id
      // @ts-expect-error - it's a valid property
      matchedProps[property] = value
    }
  }
  return matchedProps
}

function checkValue(value: ExpectedType, term: ExpectedType): boolean {
  if (typeof value === "string") {
    return value.toLowerCase().includes(term.toString().toLowerCase())
  }
  return value === term
}
