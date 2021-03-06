

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

  const startOfNumber = () => {
    const terms = state.getValue().terms
    const isBlank = terms.length === 0
    const isNumberLast = !isNaN(Number(terms[terms.length - 1]))
    const isDecimalLast = terms[terms.length - 1] === "."

    console.log({isBlank, isNumberLast, isDecimalLast})

    return isBlank || !(isNumberLast || isDecimalLast)
  }

  const decimalInNumber = () => {
    const terms = [...state.getValue().terms]
    while (terms.length > 0 && !isNaN(terms[terms.length - 1]))
      terms.pop()
    return terms[terms.length - 1] === "."
  }

  const isResultCalculated = () => {
    return !!state.getValue().result
  }

  const getResult = () => {
    return state.getValue().result
  }

  const clearResult = () => {
    const terms = [...state.getValue().terms]
    state.next({
      terms,
      result: undefined
    })
  }

  const input = (term) => {
    switch(term) {
      case operations.EQUALS:
        calculateTerms()
        break
      case operations.BACK:
        if (isResultCalculated()) {
          clearResult()
        } else {
          removeTerm()
        }
        break
      case operations.CLEAR:
        clearTerms()
        break
      case operations.ZERO:
        if (startOfNumber()) return
        addTerm(term)
        break
      case operations.DECIMAL:
        if (decimalInNumber()) return
        addTerm(term)
        break
      case operations.ADD:
      case operations.SUBTRACT:
      case operations.MULTIPLY:
      case operations.DIVIDE:
        if (isResultCalculated()) {
          const result = getResult()
          clearTerms()

          console.log({state: state.getValue(), result})

          addTerm(result)
        }
      case operations.ONE:
      case operations.TWO:
      case operations.THREE:
      case operations.FOUR:
      case operations.FIVE:
      case operations.SIX:
      case operations.SEVEN:
      case operations.EIGHT:
      case operations.NINE:
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
