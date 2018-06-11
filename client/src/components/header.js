import React from 'react';

class Header extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="col-md-offset-1">
                    <h1 className=".visible-md-* .visible-lg-* hidden-xs hidden-sm col-md-12 page-header"><strong>Student
                        Grade Table</strong>
                        <small className="col-md-offset-5">Grade Average : <span className="avgGrade">40</span></small>
                    </h1>
                    <h3 className=".visible-xs-* .visible-sm-* hidden-lg hidden-md col-xs-12"><strong>Student Grade
                        Table</strong>
                        <small className="col-xs-offset-5">Grade Average : <span className="avgGrade">40</span></small>
                    </h3>
                </div>
            </div>
        )
    }
}

export default Header;