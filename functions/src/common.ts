/**
 * 睡眠
 * @param {number} time
 * @return {Promise<void>}
 */
export function sleep(time:number):Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
