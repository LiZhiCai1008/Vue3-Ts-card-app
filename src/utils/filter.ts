/**
 * Created by lizhicai on 5/31/2021.
 */
// import fl from "./float";

export const amountFmt = (value: number): string => {
  return (value / 100).toFixed(2);
}
export const statusFmt = (value: number): string => {
  interface TypeStatus {
    [key: number]: string
  }
  const statusText: TypeStatus = {
    1: "正常",
    2: "禁用",
    3: "挂失",
    4: "补卡中",
    99: "注销",
  }
  return statusText[value];
}