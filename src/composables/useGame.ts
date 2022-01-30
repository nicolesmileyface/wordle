import { useDebounceFn } from '@vueuse/core'
import words from '../assets/words.json'
import { onMounted, reactive, UnwrapRef } from "vue"

const keys: Key[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
]
const flatKeys = keys.flat()
const _initKeys = (): Record<Letter, Color> => Object.fromEntries(flatKeys.filter(key => !['backspace', 'enter'].includes(key)).map((key: any) => [key, 'gray']))

type Color = 'gray' | 'black' | 'pink' | 'yellow'
type Key = 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p' | 'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l' | 'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm' | 'backspace' | 'enter'
type Letter = Exclude<Key, 'enter' | 'backspace'>

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
  }
}

export const useGame = (storageKey='freeplay') => {
  const localStorageKey = ['game-state', storageKey].join('-')
  const baseState: IState = {
    cacheKey: 1,
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
    }
  }
  const fromLocalStorage = (): IState => {
    const gameState = localStorage.getItem(localStorageKey)
    if(gameState) return JSON.parse(gameState)
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
    state.corpus = (words as { [key: number]: string[] })[state.numLetters]
    state.word = state.corpus[Math.floor(Math.random() * state.corpus.length)]
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
      return
    }
    if (index === state.numGuesses - 1) {
      state.modals.lost = true
    }
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

  onMounted(() => {
    document.addEventListener('keyup', (e) => {
      if ([state.modals.help, state.modals.settings, state.modals.won, state.modals.lost].some((v) => v)) {
        return
      }
      if((flatKeys as String[]).includes(e.key.toLowerCase())) {
        keyPress((e.key.toLowerCase() as Key))
      }
    })
    if(!state.inProgress || state.cacheKey !== baseState.cacheKey) {
      newGame(true)
    }
  })

  return { keys, state, keyPress, newGame }
}