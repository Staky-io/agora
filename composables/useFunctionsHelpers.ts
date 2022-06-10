type TruncateParams = {
  string: string
  start?: number
  end?: number
}

export const useFunctionsHelpers = (): Record<string, (args?: unknown) => unknown> => {
  const capitalize = (string: string): string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

  const truncateString = ({ string, start = 5, end = 5 }: TruncateParams): string => `${string.slice(0, start)}…${string.slice(string.length - end)}`
  const truncate = (args: string | TruncateParams): string => (typeof args === 'string' ? truncateString({ string: args }) : truncateString(args))

  return {
    capitalize,
    truncate,
  }
}
