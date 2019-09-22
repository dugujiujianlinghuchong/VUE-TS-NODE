export default function formatDate(strDate: string) {
  return new Date(strDate).toLocaleString().replace(`:${new Date(strDate).toLocaleString().split(":")[2]}`, "")
}