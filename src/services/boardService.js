import { slugify } from '~/utils/formatters'


const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới Model để xử lý lưu bản ghi newBoard vào Database

    // Làm thêm các xử lý logic khác với những phần liên quan đến board (Ex: Board owner, card, column....)

    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo...

    return newBoard
  } catch (error) {
    error
  }
}

export const boardService = {
  createNew
}