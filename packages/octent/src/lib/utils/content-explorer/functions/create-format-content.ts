import type { Collection, Content } from '../content-explorer'

/**
 * @param parameters The parameters to pass to the function
 * @param parameters.dataType The type of the data
 * @returns A function that formats the content
 */
export function createFormatContent(parameters: { dataType: string }) {
  return function formatContent(content: Readonly<Content<Collection>>) {
    switch (parameters.dataType) {
      case 'json': {
        return JSON.stringify(content)
      }
      default: {
        throw new Error(`Unknown data type: ${parameters.dataType}`)
      }
    }
  }
}
