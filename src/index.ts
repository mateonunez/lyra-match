import type {RetrievedDoc, SearchParams} from "@lyrasearch/lyra/dist/methods/search"
import type {ResolveSchema, PropertiesSchema} from "@lyrasearch/lyra/dist/types"

export type MatchProperty<T extends PropertiesSchema> = {id: string} & ResolveSchema<T>

export function match<T extends PropertiesSchema>(hits: RetrievedDoc<T>[], params: SearchParams<T>): MatchProperty<T>[] {
  const properties = !params.properties || params.properties === "*" ? [] : params.properties
  const {term} = params
  const matches = [] as unknown as MatchProperty<T>[]
  for (const {document} of hits) {
    const props = (properties.length > 0 ? properties : Object.keys(document)) as []
    const matchedProps = createMatchesObject(document, term, props)
    matches.push(matchedProps)
  }
  return matches
}

function createMatchesObject<T extends PropertiesSchema>(hit: ResolveSchema<T>, term: string | number | boolean, properties: string[]): MatchProperty<T> {
  const matchedProps = {} as MatchProperty<T>
  for (const property of properties) {
    const value = hit[property] as string | number | boolean
    if (checkValue(value, term)) {
      // @ts-expect-error - it's a valid property
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
