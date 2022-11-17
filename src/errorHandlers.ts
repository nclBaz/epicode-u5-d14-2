import mongoose from "mongoose"
import { ErrorRequestHandler } from "express"

export const badRequestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const unauthorizedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const forbiddenErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const notFoundErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const genericErroHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ success: false, message: "Generic Server Error" })
}
