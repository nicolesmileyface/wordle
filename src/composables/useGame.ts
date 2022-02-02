import { useDebounceFn } from '@vueuse/core'
import words from '../assets/words.json'
import { computed, onMounted, reactive, UnwrapRef } from "vue"

const keys: Key[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
]
const flatKeys = keys.flat()
const _initKeys = (): Record<Letter, Color> => Object.fromEntries(flatKeys.filter(key => !['backspace', 'enter'].includes(key)).map((key: any) => [key, 'gray']))
const HAS_TOUCHED = -7777777

type Color = 'gray' | 'black' | 'pink' | 'yellow'
type Key = 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p' | 'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l' | 'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm' | 'backspace' | 'enter'
type Letter = Exclude<Key, 'enter' | 'backspace'>
type Mode = 'freeplay' | 'daily' | 'puzzle'

interface IState {
  cacheKey: number
  inProgress: boolean
  debugging: boolean
  numLetters: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 20
  numGuesses: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
  word: string
  results: {
    solved: number
  },
  guesses: {
    final: boolean
    letters: {
      letter: Letter | null
      color: Color
    }[]
  }[],
  keyColors: {
    base: Record<Letter, Color>,
    guesses: Color[][],
  },
  loading: boolean,
  corpus: string[],
  modals: {
    help: boolean
    settings: boolean
    won: boolean
    lost: boolean
  },
  errors: {
    notInCorpus: boolean
  },
  day: number,
  history: {
    [numLetters: string]: {
      [day: string]: number
    }
  },
}

export const useGame = (mode: Mode = 'freeplay', dayParam: number | null = null) => {
  const now = new Date()
  const start = new Date(2022, 0, 0)
  const diff = Number(now) - Number(start)
  const day = dayParam !== null && dayParam >= 0 ? dayParam: Math.floor(diff / (1000 * 60 * 60 * 24))

  const getWord = (): string => {
    if(mode === 'daily') {
      state.numGuesses = 6
      return getWordOfTheDay()
    } else if (mode === 'freeplay') {
      return state.corpus[Math.floor(Math.random() * state.corpus.length)]
    } else {
      return state.corpus[0]
    }
  }
  const getWordOfTheDay = (): string => {
    let index = day
    while (index > state.corpus.length) {
      index -= state.corpus.length
    }
    return state.corpus[index]
  }
  
  const localStorageKey = ['game-state', mode].join('-')
  const baseState: IState = {
    cacheKey: 3,
    inProgress: false,
    debugging: false,
    numLetters: 5,
    numGuesses: 6,
    word: '',
    results: {
      solved: -1
    },
    guesses: [],
    keyColors: {
      base: _initKeys(),
      guesses: Array.from({ length: 6 }).map(() => Array.from({ length: 5 }))
    },
    loading: true,
    corpus: [],
    modals: {
      help: false,
      settings: false,
      won: false,
      lost: false,
    },
    errors: {
      notInCorpus: false
    },
    day: day,
    history: Object.fromEntries([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20].map(num => [`${num}`, {}]))
  }
  const fromLocalStorage = (): IState => {
    const gameState = localStorage.getItem(localStorageKey)
    if(gameState) {
      const parsed = JSON.parse(gameState)
      if(parsed.cacheKey !== baseState.cacheKey || parsed.day !== baseState.day) {
        return { ...parsed, ...baseState, history: parsed.history }
      }
      return parsed
    }
    return baseState
  }
  const updateStorage = () => {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
  const debouncedUpdateStorage = useDebounceFn(updateStorage, 1000)
  const state: UnwrapRef<IState> = reactive(fromLocalStorage())

  const newGame = async (showHelp = false) => {
    localStorage.removeItem(localStorageKey)
    state.loading = true
    state.inProgress = true
    state.history[`${state.numLetters}`][`${state.day}`] = HAS_TOUCHED
    state.corpus = (words as { [key: number]: string[] })[state.numLetters]
    state.word = getWord()
    state.guesses = Array.from({ length: state.numGuesses }).map(() => ({
      letters: Array.from({ length: state.word.length }).map(() => ({ letter: null, color: 'gray' })),
      final: false,
    }))
    state.keyColors = {
      base: _initKeys(),
      guesses: Array.from({ length: state.numGuesses }).map(() => Array.from({ length: state.numLetters })),
    }
    state.results = {
      solved: -1,
    }
    state.modals = {
      help: showHelp,
      settings: false,
      won: false,
      lost: false,
    }
    state.loading = false
    updateStorage()
  }

  const guess = (index: number) => {
    if (!state.corpus.includes(state.guesses[index].letters.map(({ letter }) => letter).join(''))) {
      state.errors.notInCorpus = true
      setTimeout(() => {
        state.errors.notInCorpus = false
      }, 1500)
      return
    }
    updateStorage()
    state.guesses[index].final = true
    state.guesses[index].letters.forEach((letter, i) => {
      if(letter.letter === null) { throw new Error('letter is null') }
      const totalLetterMatches = state.word.split('').filter((wordLetter) => letter.letter === wordLetter).length
      const totalIndexMatches = state.word.split('').filter((wordLetter, i) => state.guesses[index].letters.map(({ letter }) => letter)[i] === wordLetter && letter.letter === wordLetter).length
      const maxYellows = totalLetterMatches - totalIndexMatches
      if (letter.letter === state.word[i]) {
        letter.color = 'pink'
      } else if (state.word.includes(letter.letter) && maxYellows > 0) {
        letter.color = 'yellow'
      } else {
        letter.color = 'black'
      }
      if (!(letter.letter in state.keyColors.base) || state.keyColors.base[letter.letter] === 'black' || state.keyColors.base[letter.letter] === 'gray') {
        state.keyColors.base[letter.letter] = letter.color
      } else if (state.keyColors.base[letter.letter] === 'yellow' && letter.color === 'pink') {
        state.keyColors.base[letter.letter] = letter.color
      }
      state.keyColors.guesses[index][i] = letter.color
    })
    if (state.guesses[index].letters.map(({ letter }) => letter).join('') === state.word) {
      state.results.solved = index
      state.modals.won = true
      if(mode === 'daily') {
        console.log({ history: state.history, day: state.day, dayParam, existingRecord: state.history[`${state.numLetters}`][`${state.day}`] })
        if(state.history[`${state.numLetters}`][`${state.day}`] == null || state.history[`${state.numLetters}`][`${state.day}`] == HAS_TOUCHED) {
          state.history[`${state.numLetters}`][`${state.day}`] = index
        }
      }
      return
    }
    if (index === state.numGuesses - 1) {
      if(mode === 'daily') {
        if(state.history[`${state.numLetters}`][`${state.day}`] == null || state.history[`${state.numLetters}`][`${state.day}`] == HAS_TOUCHED) {
          state.history[state.numLetters][state.day] = -1
        }
      }
      state.modals.lost = true
    }
  }

  const getStreak = () => {
    const streaks: {
      all: { start: string, end: string }[],
      longest: number,
      current: number
    } = {
      all: [],
      longest: 0,
      current: 0
    }
    for (const [day, index] of Object.entries(state.history[state.numLetters])) {
      const indexOfCurrentStreak = streaks.all.findIndex(a => Number(a.end) === Number(day) - 1)
      if(index > -1 && indexOfCurrentStreak > -1) {
        streaks.all[indexOfCurrentStreak].end = day
      }
      else if(index > -1 && !streaks.all.some(a => a.start === day)) {
        streaks.all.push({ start: day, end: day })
      }
    }
    const sorted = streaks.all.sort((a, b) => (Number(a.end) - Number(a.start)) - (Number(b.end) - Number(b.start)))
    const current = streaks.all.find(a => Number(a.end) === state.day)
    streaks.longest = Number(sorted[0].end) - Number(sorted[0].start)
    streaks.current = current ? Number(current.end) - Number(current.start) : 0
    return { ...streaks, sorted }
  }

  const keyPress = (key: Key) => {
    if (key !== 'enter' && key !== 'backspace' && state.keyColors.base[key] === 'black') {
      return
    }
    if (state.results.solved > -1) {
      return
    }
    const index = state.guesses.findIndex((guess) => !guess.final)
    if (index === -1) {
      return
    }
    const insertIndex = state.guesses[index].letters.findIndex((letter) => !letter.letter)
    if (key === 'backspace') {
      const deleteIndex = insertIndex === 0 ? 0 : insertIndex > 0 ? insertIndex - 1 : state.word.length - 1
      state.guesses[index].letters[deleteIndex].letter = null
    } else if (key === 'enter' && insertIndex === -1) {
      guess(index)
    } else if (key !== 'enter' && insertIndex > -1) {
      state.guesses[index].letters[insertIndex].letter = (key.toLowerCase() as Letter)
    }
    debouncedUpdateStorage()
  }

  const toEmojis = () => {
    return state.guesses.map(guess => guess.letters.map(({ color }) => ({
      'gray': '',
      'black': '⬛️',
      'pink': '🟩',
      'yellow': '🟨',
    }[color])).filter(a => !!a).join('')).filter(a => !!a).join('\n')
  }

  onMounted(() => {
    document.addEventListener('keyup', (e) => {
      if ([state.modals.help, state.modals.settings, state.modals.won, state.modals.lost].some((v) => v)) {
        return
      }
      if((flatKeys as String[]).includes(e.key.toLowerCase())) {
        keyPress((e.key.toLowerCase() as Key))
      }
    })
    if(!state.inProgress || state.cacheKey !== baseState.cacheKey || state.day !== baseState.day) {
      newGame(true)
    }
    state.errors.notInCorpus = false
  })

  return { keys, state, keyPress, newGame, toEmojis, getStreak, HAS_TOUCHED }
}