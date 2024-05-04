import { boardModel } from '~/models/boardModel'
import { slugify } from '~/utils/formatters'


const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới Model để xử lý lưu bản ghi newBoard vào Database
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi mới được tạo rồi trả về (step này có thể có hoặc không tùy mục đích,
    // ví dụ FE cần show dữ vừa được tạo thì hãy trả về)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Làm thêm các xử lý logic khác với những phần liên quan đến board (Ex: Board owner, card, column....)

    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo...

    return getNewBoard
  } catch (error) {
    error
  }
}

export const boardService = {
  createNew
}