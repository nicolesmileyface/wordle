import express from 'express'
import { generateSlug } from "random-word-slugs"
import { nanoid } from 'nanoid'
const router = express.Router()


import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Puzzle = mongoose.model('Puzzle', new Schema({
  slug: String,
  title: String,
  description: String,
  author: String,
  puzzle: Array,
}))

router.get('/health', async (req, res) => {
  res.send('hello world')
})

router.get('/puzzles', async (req, res) => {
  try {
    const puzzles = await Puzzle.find()
    res.send(puzzles)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/puzzles/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const puzzle = await Puzzle.findOne({ slug }).exec()
    if (!puzzle) {
      res.status(400).send({ error: `Puzzle matching slug ${slug} does not exist` })
      return
    }
    res.send(puzzle)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params
    const puzzle = await Puzzle.findOne({ _id: id }).exec()
    if (!puzzle) {
      res.status(400).send({ error: `Puzzle matching id ${id} does not exist` })
      return
    }
    res.send(puzzle)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/puzzles', async (req, res) => {
  try {
    let { slug, puzzle, title, author, description } = req.body
    if(!puzzle) {
      res.status(400).send({ error: 'Missing params' })
      return
    }
    if(!Array.isArray(puzzle) || puzzle.some(word => {
      if(!word.word) return true
      if(word.isFleurdle === undefined) return true
    }))
    if(!slug) {
      slug = generateSlug()
    }
    const existingPuzzle = await Puzzle.findOne({ slug }).exec()
    if (existingPuzzle) {
      slug = [slug, nanoid(6)].join('-')
      const existingPuzzleBackup = await Puzzle.findOne({ slug }).exec()
      if(existingPuzzleBackup) {
        res.status(403).send({ error: 'Puzzle Exists' })
        return
      }
    }
    const result = new Puzzle({
      slug,
      title: title || slug,
      author: author || '',
      description: description || ''
    })
    await result.save()
    res.send(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

export { router }