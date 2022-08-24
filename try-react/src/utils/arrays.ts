export function distinct<T>(arr: Array<any>, key: any = 'id'): Array<T> {
  const result = []
  const map = new Map()
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (map.has(item[key])) {
      // rewrite existing object by new object
      const index:number = result.findIndex(i => i[key] === item[key])
      result[index] = item
    } else {
      // push new object
      map.set(item[key], true)
      result.push(item)
    }
  }
  return result
}
