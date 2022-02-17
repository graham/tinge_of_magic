import * as React from "react";
import * as ReactDOM from "react-dom";

class HelloWorld extends React.Component<any, any> {
    state = {
        count: 1,
    };

    componentDidMount() {
        setInterval( () => {
            this.setState((ps, ctx) => {
                return {...ps, count: ps.count+1};
            });
        }, 1000)
    }
    
    render() {
	return (
	    <div>
	        Hello World, the count is {this.state.count}
	    </div>
	);
    }
}


ReactDOM.render(<HelloWorld />,
		document.getElementById('content'));

