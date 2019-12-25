import React from 'react';

export default class Right extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultView: (
                <div style={{"height": "100%", "display":"flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "color": "grey", "opacity": "0.5"}}>
                    <img src={require('../common/holder.jpg')} style={{"height": "150px", "border-radius": "150px", "margin-bottom": "30px"}}/>
                    <span><h3>点击任务标题查看详情</h3></span>
                </div>
            ),
            isDefaultView: false
        };

        this.setDefaultView = this.setDefaultView.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    setDefaultView(trueOrFalse) {
        this.setState({
            isDefaultView: trueOrFalse
        })
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

            this.state.isDefaultView ? this.state.defaultView :
                (
                    <div className="col-md-4" style={{"height": "100%"}}>
                        <div className="desc-title" style={{"height":"10%"}}>
                            <div id='title' contentEditable="true" style={{"margin-top": "20px", "margin-left": "20px"}}>
                                {task.title === 'NULL' ? '' : task.title}
                            </div>
                        </div>
                        <div className="desc-content" style={{"height": "85%"}}>
                            <div contentEditable='true' id='content' className="desc-text" placeholder="描述">
                                {task.content === 'NULL' ? '' : task.content}
                            </div>
                        </div>
                        <button onClick={()=>{this.inputChangeTitleAndContent(task)}}>确定</button>
                    </div>
                )
        )
    }
}