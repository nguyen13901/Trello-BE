import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
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

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard

  } catch (error) {
    throw error
  }
}

/**
   * Khi di chuyển card sang Column khác
   * B1: Cập nhật mảng CardOrderIds của Column ban đầu chứa nó (Cụ thể là xóa card_id ra khỏi mảng CardOrderIds của column ban đầu)
   * B2: Cập nhật mảng CardOrderIds của Column tiếp theo (Thêm card_id vào mảng CardOrderIds)
   * B3: Cập nhật lại ColumnId của card đã kéo
*/
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // * B1: Cập nhật mảng CardOrderIds của Column ban đầu chứa nó (Cụ thể là xóa card_id ra khỏi mảng CardOrderIds của column ban đầu)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    //  * B2: Cập nhật mảng CardOrderIds của Column tiếp theo (Thêm card_id vào mảng CardOrderIds)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    //  * B3: Cập nhật lại ColumnId của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updateResult: 'Successfully!' }

  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetais,
  update,
  moveCardToDifferentColumn
}