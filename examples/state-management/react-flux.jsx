// ------------------------------------------------------------------------
// Create a new Flux Dispatcher
// ------------------------------------------------------------------------

const dispatcher = new Flux.Dispatcher();

// ------------------------------------------------------------------------
// Define Actions for the App
// ------------------------------------------------------------------------

const Actions = {
    increment() {
        dispatcher.dispatch({ type: 'increment' });
    },

    decrement() {
        dispatcher.dispatch({ type: 'decrement' });
    },

    addItem(value) {
        dispatcher.dispatch({
            type: 'add-item',
            value,
        });
    },

    toggleVisibility() {
        dispatcher.dispatch({ type: 'toggle-visibility' });
    },
};

// ------------------------------------------------------------------------
// Define the Store
// ------------------------------------------------------------------------

const Store = Object.assign({}, EventEmitter.prototype, {
    _state: {
        count: 0,
        items: [],
        isVisible: true,
    },

    getState: function() {
        return this._state;
    },

    increment: function () {
        this._state.count++;
    },

    decrement: function() {
        this._state.count--;
    },

    addItem: function(item) {
        this._state.items.push(item);
    },

    toggleVisibility: function() {
        this._state.isVisible = !this._state.isVisible;
    },

    emitChange: function () {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});

// ------------------------------------------------------------------------
// Dispatch Actions to the Store
// ------------------------------------------------------------------------

dispatcher.register(function (action) {
    switch(action.type) {
        case 'increment':
            Store.increment();
            Store.emitChange();
            break;
        case 'decrement':
            Store.decrement();
            Store.emitChange();
            break;
        case 'add-item':
            Store.addItem(action.value);
            Store.emitChange();
            break;
        case 'toggle-visibility':
            Store.toggleVisibility();
            Store.emitChange();
            break;
        default:
            throw new Error();
    }
});

// ------------------------------------------------------------------------
// Counter using Flux
// ------------------------------------------------------------------------

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = Store.getState();
    }

    componentDidMount() {
        Store.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this.handleChange);
    }

    handleChange() {
        this.setState(Store.getState());
    }

    render() {
        return (
            <div className="counter">
                <h2>Counter</h2>
                <div>
                    <button onClick={() => Actions.decrement()}>-</button>
                    <span>{this.state.count}</span>
                    <button onClick={() => Actions.increment()}>+</button>
                </div>
            </div>
        )
    }
}

// ------------------------------------------------------------------------
//
// Counter using Local State.
// These counters do not use Flux so any update is displayed
// only on the specific component.
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

class NumberList extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = Store.getState();
    }

    componentDidMount() {
        Store.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this.handleChange);
    }

    handleChange() {
        this.setState(Store.getState());
    }

    render() {
        return (
            <div>
                <button onClick={() => Actions.addItem(Math.random())}>Add Item</button>
                <button onClick={() => Actions.toggleVisibility()} disabled={this.state.items.length == 0}>
                    {this.state.isVisible ? 'Hide List' : 'Show List'}
                </button>
                <div>
                    {this.state.isVisible &&
                        <ul>
                            {this.state.items.map(item => {
                                return <li>{item}</li>
                            })}
                        </ul>}
                </div>
            </div>
        )
    }
}

// ------------------------------------------------------------------------
//
// Number Count
// Display the count of random numbers generated by the user.
//
// This component is not aware of how the numbers or actually generated
// or the details, rather it only needs to show the count. This is a good
// example of when you might want to use Flux - multiple unrelated
// components can share the same state without having to pass props around.
//
// ------------------------------------------------------------------------

class NumberCount extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = Store.getState();
    }

    componentDidMount() {
        Store.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this.handleChange);
    }

    handleChange() {
        this.setState(Store.getState());
    }

    render() {
        return (
            <div>
                <h2>Numbers List: ({this.state.items.length} Items)</h2>
            </div>
        )
    }
}

// ------------------------------------------------------------------------
// App
// ------------------------------------------------------------------------

class App extends React.Component {
    render() {
        return (
            <>
                <h1>React Flux Demo</h1>
                <p>
                    <a href="/">🏠 Back to all Examples</a>
                </p>
                <p>
                    <a href="https://facebook.github.io/flux/" target="_blank">https://facebook.github.io/flux/</a>
                </p>

                <section className="number-list">
                    <NumberCount />
                    <NumberList />
                </section>
                <section className="counters">
                    <h2>Counters with shared state using Flux</h2>
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
    <App />,
    document.getElementById('root')
);
