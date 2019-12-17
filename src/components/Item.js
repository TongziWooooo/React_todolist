
import React from 'react';

// //接收的数据的数据验证
// let propTypes = {
//     todo:PT.object,   //因为我在webpack.config内已经申明好了pt，所以可以直接用PT
//     onDestroy:PT.func,
//     onToggle:PT.func,
//     itemEditDone:PT.func
// }

export default class Item extends React.Component {

    constructor(props)
    {
        super(props);
       
        //让Item可编辑，我们设置一个state来操作
        this.state = {
            inEdit:false,
            val:''
        };
        //绑定this
        this.onEdit = this.onEdit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.itemEditDone = this.itemEditDone.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isEsc = false; //用于onBlur onEnter 方法
    }

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


    
    render() {

        
        
        //取出todo
        let {onDestroy,todo,onToggle,onChangeDisplay} = this.props;

        let {inEdit,val} = this.state;

        //定义一个className类名变量去控制li的class
        let itemClassName = todo.hasCompleted?"completed":"";

        //取出双击onEdit事件
        let {onEdit,onBlur,onEnter,inputChange} = this;

        //console.info(this.isEsc);

        if(inEdit){
            itemClassName += 'editing';
        }

        // return (
        //     <li className={itemClassName} >
        //         <div className="view">
        //             <input
        //                 type="checkbox"
        //                 className="toggle"
        //                 checked={todo.hasCompleted}
        //                 onChange={()=>{onToggle(todo)}}
        //             />
        //             <label
        //                 onDoubleClick = {onEdit}
        //             >
        //                 {todo.value}
        //             </label>
        //             <button className="destroy"
        //                 onClick = { ev=>{onDestroy(todo)} }
        //             ></button>
        //         </div>
        //         <input
        //             type="text"
        //             className="edit"
        //             value={val}
        //             onBlur={onBlur}
        //             onKeyDown={onEnter}
        //             onChange={inputChange}
        //             ref="editInput"
        //         />
        //     </li>
        // );
        return(
            <li className="task">
                <div className="glyphicon glyphicon-unchecked" style={{"padding": "5px", "display": "inline-block"}}/>
                <div style={{"display": "inline-block"}}>{todo.title}</div>
                <span style={{"float": "right", "display": "inline-block"}}>
					<span className="action-btn btn-group" style={{"margin": "0", "padding": "0"}}>
                      <button type="button" className="btn btn-default dropdown-toggle btn-xs task-project-name"
                              style={{"border": "none"}} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {todo.tag}<span className="caret" style={{"margin-left": "3px"}}/>
                      </button>
                      <ul className="dropdown-menu">
                          {
                              this.props.todoTags.map(tag=> {
                                  return(
                                      <li><a href="#"><span
                                          className="action-btn-inactive-icon glyphicon glyphicon-tag"/><span>{tag}</span></a></li>
                                  )
                              })
                          }
                      </ul>
					</span>
					<div className="ddl-time">{todo.ddlTime}</div>
					<div className="btn-group">
					  <button type="button" className="btn btn-default dropdown-toggle" style={{"border": "none"}}
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    <span className="glyphicon glyphicon-option-horizontal"
                              style={{"height": "20px", "width": "20px", "color": "#696969"}}/>
					  </button>
					  <ul className="dropdown-menu">
					    <li style={{"padding": "11px"}}><p>到期日</p><span>
						  <div className="input-group date" data-provide="datepicker"
                               style={{"padding-left": "10px", "padding-right": "10px"}}>
                            <input type="text" className="form-control" value="12-20-2019" style={{"border-radius": "10px"}}/>
                          </div>
						</span></li>
						<li role="separator" className="divider"/>
					    <li style={{"padding": "11px"}}><p>优先级</p>
						<div className="btn-group btn-group-sm" role="group" style={{"display": "table-cell"}}>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#ff1493", "background-color": "white"}}/>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#ff8c00", "background-color": "white"}}/>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#4169e1", "background-color": "white"}}/>
						  <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "grey", "background-color": "white"}}/>
                        </div>
						</li>
						<li role="separator" className="divider"/>
					    <li><a href="#"><span
                            className="action-btn-inactive-icon glyphicon glyphicon-remove-circle"/><span>删除</span></a></li>
					  </ul>
					</div>
				  </span>
            </li>
                
        )
    }
}


//绑定数据验证到Item上
// Item.propTypes = propTypes;