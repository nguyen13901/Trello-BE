import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

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

export const columnService = {
  createNew
}