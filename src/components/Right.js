import React from 'react';

export default class Right extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inEdit:false,
            val:''
        };

        this.onEdit = this.onEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.itemEditDone = this.itemEditDone.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isEsc = false; //用于onBlur onEnter 方法

    }

    //TODO: add function

    //事件回调函数，让state的inEdit改变布尔值
    onEdit()
    {
        //实现取出当前todo的value
        let {value} = this.props.todo;

        this.setState({
            inEdit:true,
            val:value
        },()=>{
            this.refs.editInput.focus()
        });
    }

    //修改item的事件   失去焦点和按下回车时改变todo的value
    onBlur(){
        if(this.isEsc === true) {this.isEsc=false; return;}
        this.itemEditDone();
    }

    onEnter(ev){
        if(ev.keyCode === 27){
            this.isEsc = true;
            //console.info(this.isEsc);
            this.setState({inEdit:false});//让输入框消失
            return;
        }
        if(ev.keyCode !== 13) return;
        this.itemEditDone();
    }

    itemEditDone()
    {
        //让输入框消失
        this.setState({inEdit:false});
        //开始保存修改的todo内容
        let {itemEditDone,todo} = this.props;   //取出传递进来的itemEditDone函数,todo
        itemEditDone(todo,this.state.val);
    }

    //定义一个修改本组件state的val的函数,用于受控组件值的修改
    inputChange(ev)
    {
        this.setState({val:ev.target.value});
    }



    render(){
        let task = this.props.displayTask;

        return(
            <div className="col-md-4" style={{"height": "100%"}}>
                <div className="desc-title">
                    <div contentEditable="true" style={{"padding-top": "20px", "padding-left": "20px"}}><h3>
                        <strong>{task.title}</strong></h3>
                    </div>
                </div>
                <div className="desc-content" style={{"height": "100%"}}>
                <textarea className="desc-text" placeholder="描述">{task.content === 'NULL' ? '' : task.content}</textarea>
                </div>
                {/* <div style={{"height": "100%", "display":"flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "color": "grey", "opacity": "0.5"}}>
                    <img src={require('./../common/holder.jpg')} style={{"height": "150px", "border-radius": "150px", "margin-bottom": "30px"}}/>
                    <span><h3>点击任务标题查看详情</h3></span>
                </div> */}
                               
            </div>
        )
    }
}