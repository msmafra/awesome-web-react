
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const createStore = Redux.createStore;

// ------------------------------------------------------------------------
//
// Define initial state for the Application.
// There are many ways to define state, however for this example page a
// single global state is used with Redux to keep the code simple.
//
// ------------------------------------------------------------------------

const initialState = {
    count: 0,
    items: [],
    isVisible: true,
};

function mapStateToProps(state) {
    return {
        count: state.count,
        items: state.items,
        isVisible: state.isVisible,
    };
}

// ------------------------------------------------------------------------
//
// Define Reducer and the Store.
//
// The reducer function is "pure" function that receives the previous
// state with an action and returns a new state.
//
// Many apps built with Redux will have multiple reducers. For
// simplicity this page defines all reducers in a single function.
//
// ------------------------------------------------------------------------

function reducer(state = initialState, action) {
    switch(action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1, // Add Count by 1
                items: state.items,
                isVisible: state.isVisible,
            };
        case 'DECREMENT':
            return {
                count: state.count - 1, // Subtract Count by 1
                items: state.items,
                isVisible: state.isVisible,
            };
        case 'ADD_ITEM':
            return {
                count: state.count,
                items: state.items.concat(action.item), // Add item to a new array
                isVisible: state.isVisible,
            };
        case 'TOGGLE_VISIBILITY':
            return {
                count: state.count,
                items: state.items,
                isVisible: !state.isVisible, // Change from `true` to `false` and vice-versa
            };
        // NOTE - you can use the spread syntax `...` to return all
        // other properties for the state as shown below. In the
        // code above all properties are named to keep the example
        // clear and easy to follow.
        //
        // case 'ADD_ITEM':
        //     return {
        //         ...state,
        //         items: state.items.concat(action.item),
        //     };
        default:
            return state;
    }
}

// This will be passed to <Provider> when the app is rendered.
const store = createStore(reducer);

// ------------------------------------------------------------------------
//
// Counter using Redux
//
// When an action `this.props.dispatch` is called for one counter all
// counters on the page will show the changed value. While this specific
// component would not likely be included in a real app it shows how
// multiple un-related components can share the same state with Redux.
//
// ------------------------------------------------------------------------

class CounterView extends React.Component {
    constructor(props) {
        super(props);
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment() {
        this.props.dispatch({ type: 'INCREMENT' });
    }

    decrement() {
        this.props.dispatch({ type: 'DECREMENT' });
    }

    render() {
        return (
            <div className="counter">
                <h2>Counter</h2>
                <div>
                    <button onClick={this.decrement}>-</button>
                    <span>{this.props.count}</span>
                    <button onClick={this.increment}>+</button>
                </div>
            </div>
        )
    }
}

// The <Counter> component is created by connecting
// `mapStateToProps` back to the view component.
//
// When this happens `this.props.count` and other defined props
// will be made available to the component when it is created.
//
const Counter = connect(mapStateToProps)(CounterView);

// ------------------------------------------------------------------------
//
// Counter using Local State.
//
// These counters do not use Redux so any update is displayed
// only on the specific component. This example shows that you can
// still use regular state and components in a Redux app. Bascially
// parts of your app can use Redux for state when it makes sense while
// using Redux is not required for all components.
//
// ------------------------------------------------------------------------

class CounterLocal extends React.Component {
    constructor(props) {
        super(props);
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.state = {
            count: 0,
        };
    }

    increment() {
        this.setState({
            count: this.state.count + 1,
        });
    }

    decrement() {
        this.setState({
            count: this.state.count - 1,
        });
    }

    render() {
        return (
            <div className="counter">
                <h3>Counter</h3>
                <div>
                    <button onClick={this.decrement}>-</button>
                    <span>{this.state.count}</span>
                    <button onClick={this.increment}>+</button>
                </div>
            </div>
        )
    }
}

// ------------------------------------------------------------------------
//
// Number List.
// Show a list of random numbers generated by the user and allow
// the user to click on a button to generate new numbers.
//
// ------------------------------------------------------------------------

class NumberListView extends React.Component {
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    addItem() {
        this.props.dispatch({
            type: 'ADD_ITEM',
            item: Math.random(),
        });
    }

    toggleVisibility() {
        this.props.dispatch({ type: 'TOGGLE_VISIBILITY' });
    }

    render() {
        return (
            <div>
                <button onClick={this.addItem}>Add Item</button>
                <button onClick={this.toggleVisibility} disabled={this.props.items.length == 0}>
                    {this.props.isVisible ? 'Hide List' : 'Show List'}
                </button>
                <div>
                    {this.props.isVisible &&
                        <ul>
                            {this.props.items.map(item => {
                                return <li>{item}</li>
                            })}
                        </ul>}
                </div>
            </div>
        )
    }
}
const NumberList = connect(mapStateToProps)(NumberListView);

// ------------------------------------------------------------------------
//
// Number Count
// Display the count of random numbers generated by the user.
//
// This component is not aware of how the numbers or actually generated
// or the details, rather it only needs to show the count. This is a good
// example of when you might want to use Redux - multiple unrelated
// components can share the same state without having to pass props around.
//
// ------------------------------------------------------------------------

class NumberCountView extends React.Component {
    render() {
        return (
            <div>
                <h2>Numbers List: ({this.props.items.length} Items)</h2>
            </div>
        )
    }
}
const NumberCount = connect(mapStateToProps)(NumberCountView);

// ------------------------------------------------------------------------
// App
// ------------------------------------------------------------------------

class App extends React.Component {
    render() {
        return (
            <>
                <h1>React Redux Demo</h1>
                <p>
                    <a href="/">🏠 Back to all Examples</a>
                </p>
                <p>
                    <a href="https://react-redux.js.org/" target="_blank">https://react-redux.js.org/</a>
                </p>

                <section className="number-list">
                    <NumberCount />
                    <NumberList />
                </section>
                <section className="counters">
                    <h2>Counters with shared state using Redux</h2>
                    <div>
                        <Counter />
                        <Counter />
                    </div>
                </section>
                <section className="counters">
                    <h2>Counters using local state</h2>
                    <div>
                        <CounterLocal />
                        <CounterLocal />
                    </div>
                </section>
            </>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
