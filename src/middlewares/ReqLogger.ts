import { NextFunction, RequestHandler, Request, Response } from "express"
import expressWinston from 'express-winston'
import winston from 'winston'
import { HTTPError } from '../assets/HTTPError'

export const reqLogger = () => expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
})