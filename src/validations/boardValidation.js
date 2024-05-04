
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  /**
   * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho Front-end tự 
   * validate và custom message phía FE cho đẹp
   * Back-end chỉ cần validate Đảm Bảo Dữ Liệu Chuẩn Xác, và trả về message mặc định từ thư viện là được
   * Quan trọng: Việc validate dữ liệu BẮT BUỘC phải có ở phía Backend vì đây là điểm cuối để lưu trữ dữ
   * liệu vào Database
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả Backend và Frontend
  **/
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(255).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title max must be less than or equal 50 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {

    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}