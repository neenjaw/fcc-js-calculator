/*
 *
 * REACT
 *
 */

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const term = this.props.term
    // console.log(`Clicked ${term}`)
    this.props.inputTerm(this.props.term)
  }

  render() {
    const p =  this.props
    return (
      <button id={p.id} className={p.classes} onClick={this.handleClick}>{p.display}</button>
    )
  }
}

class Term extends React.Component {
  render() {
    const result = this.props.result
    const terms = [...this.props.terms]
    const lastTerm = terms[terms.length - 1]

    const getLastNumber = (terms) => {
      const digits = [...terms]
      const last = []
      while (digits.length > 0 && (!isNaN(digits[digits.length - 1]) || digits[digits.length - 1] === "."))
        last.push(digits.pop())
      return last.reverse().join("")
    }

    const display = (result)
                    ? result
                    : (terms.length === 0)
                      ? "0"
                      : (lastTerm !== "." && isNaN(Number(lastTerm)))
                        ? terms[terms.length - 1]
                        : getLastNumber(terms)

    // console.log({display})

    return (
      <div id="display">{display}</div>
    )
  }
}

class Formula extends React.Component {
  render() {
    const displayTerms = this.props.terms.join("")

    const display = (this.props.result === undefined)
                    ? displayTerms
                    : `${displayTerms}=${this.props.result}`

    return (
      <div className="formula">{display}</div>
    )
  }
}

const buttons = [
  {
    id: "zero",
    classes: "btn-num-0",
    display: "0",
    value: operations.ZERO
  },
  {
    id: "one",
    classes: "btn-num-1",
    display: "1",
    value: operations.ONE
  },
  {
    id: "two",
    classes: "btn-num-2",
    display: "2",
    value: operations.TWO
  },
  {
    id: "three",
    classes: "btn-num-3",
    display: "3",
    value: operations.THREE
  },
  {
    id: "four",
    classes: "btn-num-4",
    display: "4",
    value: operations.FOUR
  },
  {
    id: "five",
    classes: "btn-num-5",
    display: "5",
    value: operations.FIVE
  },
  {
    id: "six",
    classes: "btn-num-6",
    display: "6",
    value: operations.SIX
  },
  {
    id: "seven",
    classes: "btn-num-7",
    display: "7",
    value: operations.SEVEN
  },
  {
    id: "eight",
    classes: "btn-num-8",
    display: "8",
    value: operations.EIGHT
  },
  {
    id: "nine",
    classes: "btn-num-9",
    display: "9",
    value: operations.NINE
  },
  {
    id: "decimal",
    classes: "btn-decimal",
    display: ".",
    value: operations.DECIMAL
  },
  {
    id: "add",
    classes: "btn-add",
    display: "+",
    value: operations.ADD
  },
  {
    id: "subtract",
    classes: "btn-subtract",
    display: "-",
    value: operations.SUBTRACT
  },
  {
    id: "multiply",
    classes: "btn-multiply",
    display: "*",
    value: operations.MULTIPLY
  },
  {
    id: "divide",
    classes: "btn-divide",
    display: "/",
    value: operations.DIVIDE
  },
  {
    classes: "btn-l-bracket",
    display: "(",
    value: operations.LBRACKET
  },
  {
    classes: "btn-r-bracket",
    display: ")",
    value: operations.RBRACKET
  },
  {
    id: "equals",
    classes: "btn-equals",
    display: "=",
    value: operations.EQUALS
  },
  {
    id: "clear",
    classes: "btn-clear",
    display: "C",
    value: operations.CLEAR
  },
  {
    classes: "btn-back",
    display: "B",
    value: operations.BACK
  }
]

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      terms: [],
      result: undefined
    }
    this.inputTerm = this.inputTerm.bind(this)
  }

  componentDidMount() {
    this.subscription = termEngine.state.subscribe(state => {
      this.setState(() => ({
        terms: [...state.terms],
        result: state.result
      }))
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  inputTerm(term) {
    console.log(term)
    termEngine.input(term)
  }

  render() {
    return (
      <div id="calculator">
        <div className="display">
          <Formula terms={this.state.terms} result={this.state.result} />
          <Term terms={this.state.terms} result={this.state.result}/>
        </div>
        <div className="buttons">
          { buttons.map(props => (
            <Button
              key={props.classes}
              id={props.id}
              classes={props.classes}
              display={props.display}
              term={props.value}
              inputTerm={this.inputTerm}
              />
          )) }
        </div>
      </div>
    )
  }
}

const element = <Calculator />;
const app = document.getElementById('app');
ReactDOM.render(element, app);