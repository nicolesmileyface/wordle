const express = require('express')
const { generateSlug } = require("random-word-slugs")
const { nanoid } = require('nanoid')
const router = express.Router()


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Puzzle = mongoose.model('Puzzle', new Schema({
  slug: String,
  title: String,
  description: String,
  author: String,
  puzzle: Array,
}))

const filterProperties = (puzzle) => ({
  slug: puzzle.slug,
  title: puzzle.title,
  description: puzzle.description,
  author: puzzle.author,
  puzzle: puzzle.puzzle,
})

router.get('/health', async (req, res) => {
  res.send('hello world')
})

router.get('/puzzles', async (req, res) => {
  try {
    const puzzles = await Puzzle.find()
    res.send(puzzles.map(filterProperties))
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/puzzles/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    let puzzle = await Puzzle.findOne({ slug }).exec()
    if (!puzzle) {
      puzzle = await Puzzle.findOne({ _id: slug }).exec()
      if (!puzzle) {
        res.status(400).send({ error: `Puzzle matching "${slug}" does not exist` })
        return
      }
    }
    res.send(filterProperties(puzzle))
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
    console.log({ slug, puzzle, title, author, description })
    if(!Array.isArray(puzzle) || puzzle.some(word => {
      if(!word.word) return true
      if(word.isFleurdle === undefined) return true
    }))
    console.log('valid puzzle')
    if(!slug) {
      slug = generateSlug()
    }
    const existingPuzzle = await Puzzle.findOne({ slug }).exec()
    console.log({ existingPuzzle })
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
      description: description || '',
      puzzle
    })
    console.log({result})
    await result.save().catch(() => { throw new Error('couldnt save')})
    res.send(filterProperties(result))
  } catch (error) {
    console.log({ error })
    res.status(500).send(error)
  }
})

module.exports = { router }