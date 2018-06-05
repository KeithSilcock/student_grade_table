import React from 'react';
import {connect} from 'react-redux';
import {incrementCount} from '../actions'

class Counter extends React.Component{



    render(){

        const {count} = this.props;

        return(
            <div>
                <h1>Count: {count}</h1>
                <button onClick={()=>{this.props.incrementCount(count)}}>Increment</button>
            </div>
        )
    }

}

function mapStateToProps(state){
    return {
        count: state.countReducer.count,
    }
}


export default connect(mapStateToProps, {incrementCount})(Counter);