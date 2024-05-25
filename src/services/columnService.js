import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // Xử lý mối quan hệ giữa column và board
    if (getNewColumn) {
      // Xử lý cấu trúc dữ liệu trả về phía FE
      getNewColumn.cards = []

      // Cập nhật lại mảng ColumnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await columnModel.update(columnId, updateData)

    return updatedBoard

  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {

    // Get data của column được xóa
    const targetColumnn = await columnModel.findOneById(columnId)

    if (!targetColumnn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    // Xóa column
    await columnModel.deleteOneById(columnId)

    // Xóa toàn bộ Cards thuộc column trên
    await cardModel.deleteManyCardsByColumnId(columnId)

    // Xóa columnId trong mảng columnOrderIds của board
    await boardModel.pullColumnOrderIds(targetColumnn)

    return { deleteResult: 'Column is delete successfully!!' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}