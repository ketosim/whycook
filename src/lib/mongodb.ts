import type { Mongoose } from 'mongoose'
import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  } | undefined
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local')
}

const MONGODB_URI: string = process.env.MONGODB_URI

const cached = global._mongoose ?? {
  conn: null,
  promise: null
}
global._mongoose = cached

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'dinner-planner',  // This will ensure we connect to the right database
      retryWrites: true    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

export default connectDB