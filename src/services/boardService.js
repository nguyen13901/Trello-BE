import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
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
    throw error
  }
}

const getDetais = async (boardId) => {
  try {

    const board = await boardModel.getDetais(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // B1: Deep Clone sẽ tạo ra 1 cái mới để xử lý, không ảnh hưởng tới dữ liệu ban đầu
    const resBoard = cloneDeep(board)

    // B2: Đưa card về đúng với column của nó
    resBoard.columns.forEach(column => {
      // Support từ javascipt
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // Hàm equals được support từ mongodb
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // B3: Xóa mảng cards ra khỏi board ban đầu

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetais
}