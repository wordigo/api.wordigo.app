export const successResult = (data: object | string | number | boolean | null | undefined, message: string, messageCode: string) => {
  return {
    success: true,
    data,
    message,
    messageCode,
  }
}

export const successPaginationResult = (
  data: object | string | number | boolean | null,
  page: number,
  pageSize: number,
  message: string,
  messageCode: string
) => {
  return {
    success: true,
    page,
    pageSize,
    data,
    message,
    messageCode,
  }
}

export const errorResult = (data: object | string | number | boolean | null, message: string, messageCode: string) => {
  return {
    success: false,
    data,
    message,
    messageCode,
  }
}
