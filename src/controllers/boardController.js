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

const getDetais = async (req, res, next) => {
  try {

    const boardId = req.params.id

    const board = await boardService.getDetais(boardId)

    // Trả kết quả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetais
}