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
                <div className="desc-title">
                    <div className="desc-title-text" placeholder="准备做什么？" id='title' contentEditable="true" style={{"margin-top": "20px", "margin-left": "20px"}}>
                        {task.title === 'NULL' ? '' : task.title}</div>
                </div>
                <div className="divider"/>                
		            <div contentEditable='true' id='content' className="desc-text" placeholder="描述">
                        {task.content === 'NULL' ? '' : task.content}
		            </div>
                <div className="divider"/>
                <button className="btn btn-large" style={{"margin-top": "14px", "background": "rgba(106,90,205,0.8)", "color": "white"}} 
                onClick={()=>{this.inputChangeTitleAndContent(task)}}>保存</button>
            </div>
        )
    }
}