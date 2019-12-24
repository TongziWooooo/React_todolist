import React from 'react';

export default class Right extends React.Component {
    constructor(props) {
        super(props);

    }



    inputChangeTitleAndContent(task) {
        let title = document.getElementById('title');
        title = title === null ? 'NULL' : title.innerText;
        let content = document.getElementById('content');
        content = content === null ? 'NULL' : content.innerText;
        let {onChangeTitle, onChangeContent} = this.props;
        onChangeTitle(task, title);
        onChangeContent(task, content);
    }

    render(){
        let task = this.props.displayTask;

        return(
            <div className="col-md-4" style={{"height": "100%"}}>
                <div className="desc-title" style={{"height":"10%"}}>
                    <div id='title' contentEditable="true" style={{"margin-top": "20px", "margin-left": "20px"}}>
                        {task.title === 'NULL' ? '' : task.title}</div>
                </div>
                <div className="desc-content" style={{"height": "85%"}}>
		            <div contentEditable='true' id='content' className="desc-text" placeholder="描述">
                        {task.content === 'NULL' ? '' : task.content}
		            </div>
                </div>
                <button onClick={()=>{this.inputChangeTitleAndContent(task)}}>确定</button>
            </div>
        )
    }
}