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
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  EQUALS: "=",
  CLEAR: "clear",
  BACK: "back"
}

const createEngine = () =>{
  const terms = new Rx.BehaviorSubject([])

  const addTerm = (term) => {
    terms.next([...terms.getValue(), term])
  }

  const removeTerm = () => {
    const nextTerms = [...terms.getValue()]
    nextTerms.pop()
    terms.next(nextTerms)
  }

  const clearTerms = () => {
    terms.next([])
  }

  const input = (term) => {
    switch(term) {
      case operations.EQUALS:
        return calculate(terms.getValue().join(""))
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
      case operations.SUBTRACT:
      case operations.MULTIPLY:
      case operations.DIVIDE:
        addTerm(term)
        break
    }
  }

  const get = () => {
    return [...terms.getValue()]
  }

  const show = () => {
    return terms.getValue().join("")
  }

  return {
    input,
    get,
    show,
  }
}

const termEngine = createEngine()
