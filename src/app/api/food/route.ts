import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Food from '@/models/Food'
import mongoose from 'mongoose'

export async function GET() {
    try {
      await connectDB()
      
      // Get database name safely
      if (!mongoose.connection || !mongoose.connection.db) {
        throw new Error('Database connection not established')
      }
      
      const dbName = mongoose.connection.db.databaseName
      console.log('Database:', dbName)
      
      const foods = await Food.find().sort({ name: 1 })
      // console.log('Foods found:', foods)
      
      return NextResponse.json({
        database: dbName,
        foodsCount: foods.length,
        foods: foods
      })
    } catch (error) {
      console.error('Error in GET:', error)
      return NextResponse.json(
        { error: 'Failed to fetch foods' }, 
        { status: 500 }
      )
    }
}
// POST - Create new food item
export async function POST(request: Request) {
    try {
      const body = await request.json()
      await connectDB()
      const food = await Food.create(body)
      return NextResponse.json(food, { status: 201 })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create food'
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  }
// PUT - Update food item
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body

    await connectDB()
    const food = await Food.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    )

    if (!food) {
      return NextResponse.json(
        { error: 'Food not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(food)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update food'

    return NextResponse.json(
      { error: errorMessage}, 
      { status: 500 }
    )
  }
}

// DELETE - Delete food item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' }, 
        { status: 400 }
      )
    }

    await connectDB()
    const food = await Food.findByIdAndDelete(id)

    if (!food) {
      return NextResponse.json(
        { error: 'Food not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Food deleted successfully' }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete food'

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}