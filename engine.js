/*
 *
 * TERM ENGINE SERVICE
 *
 */

const operations = {
  ZERO: "0",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  DECIMAL: ".",
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  LBRACKET: "(",
  RBRACKET: ")",
  EQUALS: "=",
  CLEAR: "clear",
  BACK: "back",
}

const createEngine = () =>{
  const state = new rxjs.BehaviorSubject({
    terms: [],
    result: undefined
  })

  const addTerm = (term) => {
    state.next({
      terms: [...state.getValue().terms, term],
      result: undefined
    })
  }

  const removeTerm = () => {
    const nextTerms = [...state.getValue().terms]
    nextTerms.pop()
    state.next({
      terms: nextTerms,
      result: undefined
    })
  }

  const clearTerms = () => {
    state.next({
      terms: [],
      result: undefined
    })
  }

  const calculateTerms = () => {
    const nextTerms = [...state.getValue().terms]
    state.next({
      terms: nextTerms,
      result: calculate(nextTerms.join(""))
    })
  }

  const input = (term) => {
    switch(term) {
      case operations.EQUALS:
        calculateTerms()
        break
      case operations.BACK:
        removeTerm()
        break
      case operations.CLEAR:
        clearTerms()
        break
      case operations.ZERO:
      case operations.ONE:
      case operations.TWO:
      case operations.THREE:
      case operations.FOUR:
      case operations.FIVE:
      case operations.SIX:
      case operations.SEVEN:
      case operations.EIGHT:
      case operations.NINE:
      case operations.ADD:
      case operations.DECIMAL:
      case operations.SUBTRACT:
      case operations.MULTIPLY:
      case operations.DIVIDE:
      case operations.LBRACKET:
      case operations.RBRACKET:
        addTerm(term)
        break
    }
  }
  return {
    state,
    input,
  }
}

const termEngine = createEngine()

termEngine
  .state
  .subscribe(
    state => console.log(state)
  )