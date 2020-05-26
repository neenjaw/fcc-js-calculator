/*
 *
 * REACT
 *
 */

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleClick() {
    const term = this.props.term
    this.props.inputTerm(this.props.term)
  }

  handleKeyDown(e) {
    const match = (key) => {
      if (Array.isArray(this.props.keyCode)) {
        return this.props.keyCode.some(code => key === code)
      } else {
        return key === this.props.keyCode
      }
    }

    if (match(e.key)) {
      document.querySelector(`.${this.props.classes}`).focus()
      this.handleClick()
    }
  }

  render() {
    const p =  this.props

    if (p.display === "B") {
      return (
        <button
          id={p.id}
          className={p.classes}
          onClick={this.handleClick}>
          <i className="fas fa-arrow-left"></i>
        </button>
      )
    } else {
      return (
        <button
          id={p.id}
          className={p.classes}
          onClick={this.handleClick}>
          {p.display}
        </button>
      )
    }
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

    if (display == "") {
      return (
        <div className="formula">&nbsp;</div>
      )
    } else {
      return (
        <div className="formula">{display}</div>
      )
    }
  }
}

const buttons = [
  {
    id: "zero",
    keyCode: "0",
    classes: "btn-num-0",
    display: "0",
    value: operations.ZERO
  },
  {
    id: "one",
    keyCode: "1",
    classes: "btn-num-1",
    display: "1",
    value: operations.ONE
  },
  {
    id: "two",
    keyCode: "2",
    classes: "btn-num-2",
    display: "2",
    value: operations.TWO
  },
  {
    id: "three",
    keyCode: "3",
    classes: "btn-num-3",
    display: "3",
    value: operations.THREE
  },
  {
    id: "four",
    keyCode: "4",
    classes: "btn-num-4",
    display: "4",
    value: operations.FOUR
  },
  {
    id: "five",
    keyCode: "5",
    classes: "btn-num-5",
    display: "5",
    value: operations.FIVE
  },
  {
    id: "six",
    keyCode: "6",
    classes: "btn-num-6",
    display: "6",
    value: operations.SIX
  },
  {
    id: "seven",
    keyCode: "7",
    classes: "btn-num-7",
    display: "7",
    value: operations.SEVEN
  },
  {
    id: "eight",
    keyCode: "8",
    classes: "btn-num-8",
    display: "8",
    value: operations.EIGHT
  },
  {
    id: "nine",
    keyCode: "9",
    classes: "btn-num-9",
    display: "9",
    value: operations.NINE
  },
  {
    id: "decimal",
    keyCode: ".",
    classes: "btn-decimal",
    display: ".",
    value: operations.DECIMAL
  },
  {
    id: "add",
    keyCode: "+",
    classes: "btn-add",
    display: "+",
    value: operations.ADD
  },
  {
    id: "subtract",
    keyCode: "-",
    classes: "btn-subtract",
    display: "-",
    value: operations.SUBTRACT
  },
  {
    id: "multiply",
    keyCode: "*",
    classes: "btn-multiply",
    display: "*",
    value: operations.MULTIPLY
  },
  {
    id: "divide",
    keyCode: "/",
    classes: "btn-divide",
    display: "/",
    value: operations.DIVIDE
  },
  {
    classes: "btn-l-bracket",
    keyCode: "(",
    display: "(",
    value: operations.LBRACKET
  },
  {
    classes: "btn-r-bracket",
    keyCode: ")",
    display: ")",
    value: operations.RBRACKET
  },
  {
    id: "equals",
    keyCode: ["=", "Enter"],
    classes: "btn-equals",
    display: "=",
    value: operations.EQUALS
  },
  {
    id: "clear",
    keyCode: "Escape",
    classes: "btn-clear",
    display: "C",
    value: operations.CLEAR
  },
  {
    classes: "btn-back",
    keyCode: "Backspace",
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
              keyCode={props.keyCode}
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
