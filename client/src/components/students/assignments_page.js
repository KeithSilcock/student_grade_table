import React from 'react';
import {connect} from 'react-redux';
import {getStudentAssignmentList} from '../../actions';


class AssignmentPage extends React.Component{
    constructor(props){
        super(props);

        this.props.getStudentAssignmentList();
    }

    populateAssignmentList(){

        return this.props.assignmentList.map( (item, index) => {
            return(
                <tr key={index}>
                    <td>{item.assignment_name}</td>
                    <td>{item.score} / {item.points_total}</td>
                    <td>{item.comments}</td>
                </tr>
            )
        })
    }

    render(){
        console.log('assignments page render props: ', this.props)

        const assignmentData = this.populateAssignmentList();

        return(
            <div className="col-md-offset-1 col-md-8 col-xs-12 pull-left">
                <div id="dataTable" className="student-list-container form-group col-md-12 dataTable">
                    <table className="student-list-container student-list table">
                        <thead className="col-xs-12">
                        <tr>
                            <th className="sortableHeader" data-sort="name">Assignment Name
                                <div className="arrowSegment arrowname arrowUnsorted" data-sort="name"></div>
                            </th>
                            <th className="sortableHeader" data-sort="course">Score
                                <div className="arrowSegment arrowcourse arrowUnsorted" data-sort="course"></div>
                            </th>
                            <th className="sortableHeader" data-sort="grade">Comments
                                <div className="arrowSegment arrowgrade arrowUnsorted" data-sort="grade"></div>
                            </th>
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody className="studentTableBody col-xs-12">
                        {assignmentData}
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        assignmentList: state.assignmentList.assignment_list,
    }
}

export default connect(mapStateToProps, {getStudentAssignmentList})(AssignmentPage);