import React from 'react';
import {connect} from 'react-redux';
import {incrementCount} from '../actions'

class AddStudent extends React.Component{

    render(){


        return(
            <div className="col-md-3 pull-right">
                <div className="student-add-form form-group">
                    <h4><strong>Add Student</strong></h4>

                    <div className="input-group form-group col-xs-12 col-md-10">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-user"></span></span>
                        <input type="text" className="form-control student" name="studentName" id="studentName" placeholder="Student Name"
                               value="Keith" />
                    </div>

                    <div className="input-group form-group col-xs-12 col-md-10">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-list-alt"></span></span>
                        <div id="courseCont">
                            <input type="text" className="form-control student" name="course" id="course"
                                   placeholder="Student Course" value="" />
                        </div>
                    </div>

                    <div className="input-group form-group col-xs-12 col-md-10">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-education"></span></span>
                        <input type="text" className="form-control student" name="studentGrade" id="studentGrade"
                               placeholder="Student Grade" value="80" />
                    </div>

                    <button type="button" className="btn btn-success addButton">Add</button>
                    <button type="button" className="btn btn-default clearButton">Clear</button>
                    <button type="button" className="btn btn-info getDataButton">Refresh Data</button>
                </div>

            </div>
        )
    }

}

function mapStateToProps(state){
    return {
        count: state.countReducer.count,
    }
}


export default connect(mapStateToProps, {incrementCount})(AddStudent);