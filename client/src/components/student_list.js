import React from 'react';
import {connect} from 'react-redux';
import {getStudentList} from '../actions';

class StudentList extends React.Component{



    render(){
        console.log(this.props.getStudentList());
        this.props
        debugger
        return(
            <div className="col-md-offset-1 col-md-8 col-xs-12 pull-left">

                <div id="dataTable" className="student-list-container form-group col-md-12 dataTable">
                    <table className="student-list-container student-list table">
                        <thead className="col-xs-12">
                        <tr>
                            <th className="sortableHeader" data-sort="name">Student Name
                                <div className="arrowSegment arrowname arrowUnsorted" data-sort="name"></div>
                            </th>
                            <th className="sortableHeader" data-sort="course">Student Course
                                <div className="arrowSegment arrowcourse arrowUnsorted" data-sort="course"></div>
                            </th>
                            <th className="sortableHeader" data-sort="grade">Student Grade
                                <div className="arrowSegment arrowgrade arrowUnsorted" data-sort="grade"></div>
                            </th>
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody className="studentTableBody col-xs-12">
                        </tbody>
                    </table>
                </div>

            </div>
        )
    }

}

function mapStateToProps(state){
    return {
        studentList: state.studentList.student_list,
    }
}


export default connect(mapStateToProps, {getStudentList})(StudentList);