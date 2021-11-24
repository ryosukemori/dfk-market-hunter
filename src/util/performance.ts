let startTime: number = 0
let endTime: number = 0

export const setStartTime = () => {
  startTime = performance.now()
}
export const setEndTime = () => {
  endTime = performance.now()
}

export const measure = () => {
  console.log('measure(ms) :', endTime - startTime)
  return endTime - startTime
}
