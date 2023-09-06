export const successResult = (data: object | string | number | boolean | null | undefined, message: string, messageCode?: string) => {
  return {
    success: true,
    data,
    message,
    messageCode,
  }
}

export const errorResult = (data: object | string | number | boolean | null, message: string, messageCode?: string) => {
  return {
    success: false,
    data,
    message,
    messageCode,
  }
}

export interface PaginationType {
  page: number
  size: number
  totalPage: number
  totalCount: number
}

export const successPaginationResult = (
  data: object | string | number | boolean | null,
  pagination: PaginationType,
  message: string,
  messageCode?: string
) => {
  return {
    success: true,
    data,
    pagination,
    message,
    messageCode,
  }
}
