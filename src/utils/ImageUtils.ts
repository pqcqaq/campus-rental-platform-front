const baseURL = import.meta.env.VITE_BASEURL

export async function transIdToUrl(imgId: string): Promise<string> {
  return baseURL + '/common/img/' + imgId
}
