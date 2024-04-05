export const showCreateOrUpdateTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleString()
}
