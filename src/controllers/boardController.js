import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {

    // Điều hướng sang tầng service
    const createBoard = await boardService.createNew(req.body)

    // Trả kết quả về phía client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}