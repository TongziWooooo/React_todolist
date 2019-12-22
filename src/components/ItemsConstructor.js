import Item from "./Item"; //每一项todo组件
import React from 'react';
import * as CONSTANT from './Common';


export default class Middle extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        let boxDict = this.props.boxDict;

        let items = boxDict.map((x, i)=> {
            return(
                <div className="task-list-content">
                    <section className="task-section">
                        <div className="section-header">
                            <div>
                                <a data-toggle="collapse" data-parent="#accordion" href={"#opened" + i}>
                                    <span className="inline-icon glyphicon glyphicon-th-list"/>
                                    {x.key}
                                    <span className="badge" style={{"float": "right"}}>{x.value.length}</span>
                                </a>
                            </div>
                        </div>
                        <ul id={"opened" + i} className="collapse in">
                            {x.value}
                        </ul>
                    </section>
                </div>
            )
        });
        return (
            <div className="task-list-scroll" style={{"height":"100%"}}>
                <div className="task-list-content">
                    {items}
                </div>
            </div>
        )
    }
}