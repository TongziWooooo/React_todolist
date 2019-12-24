
import React from 'react';
import * as CONSTANT from './Common';
import {dateToPicker} from './Common'
// import MyDatePicker from './Common';

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
        let {todo, onDelete, onToggle, onChangePriority, onChangeDisplay, onChangeTag, onChangeDate} = this.props;

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
            <li className="task" onClick={()=>onChangeDisplay(todo)}>
                <div className={todo.state === CONSTANT.DONE_NOT_DELETED?"glyphicon glyphicon-check":"glyphicon glyphicon-unchecked"}
                     style={{"padding": "5px", "display": "inline-block"}}
                     onClick={()=>onToggle(todo)}/>
                <div style={{"display": "inline-block"}}>{todo.title === 'NULL' ? '' : todo.title}</div>
                <span style={{"float": "right", "display": "inline-block"}}>
					<span className="action-btn btn-group" style={{"margin": "0", "padding": "0"}}>
                      <button type="button" className="btn btn-default dropdown-toggle btn-xs task-project-name"
                              style={{"border": "none"}} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {todo.tag === 'default' ? '未设置' : todo.tag}<span className="caret" style={{"margin-left": "3px"}}/>
                      </button>
                      <ul className="dropdown-menu">
                          {
                              this.props.todoTags.map(tag=> {
                                  return(
                                      <li><a href="#" onClick={()=>onChangeTag(todo, tag)}>
                                          <span className="action-btn-inactive-icon glyphicon glyphicon-tag"/>
                                          <span>
                                              {tag}
                                          </span>
                                      </a></li>
                                  )
                              })
                          }
                            <li role="separator" className="divider"/>
                            <li><form className="form-inline" role="form" style={{"padding": "6px"}}>
                                <label htmlFor="name" className="sr-only">名称</label>
                                <input type="text" className="form-control" id="name" placeholder="创建清单"
                                       style={{"width": "100px"}} ref={input => this.input = input}/>
                                <button type="submit" className="btn btn-default btn-sm"
                                        style={{"border-radius": "7px", "margin-left": "5px"}}
                                        onClick={()=>onChangeTag(todo, this.input.value)}>
                                    <span className="glyphicon glyphicon-plus"/></button>
                            </form></li>
                      </ul>
					</span>
					<div className="ddl-time">{todo.ddl_time === '2020/02/02'?'未设置':todo.ddl_time}</div>
					<div className="btn-group">
					  <button type="button" className="btn btn-default dropdown-toggle btn-xs" style={{"border": "none"}}
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    <span className="glyphicon glyphicon-option-horizontal"
                              style={{"height": "20px", "width": "20px", "color": "#696969"}}/>
					  </button>
					  <ul className="dropdown-menu">
					    <li style={{"padding": "11px"}}><p>到期日</p><span>
                            {/*<MyDatePicker/>*/}
						  <div className="input-group date" data-provide="datepicker"
                               style={{"padding-left": "10px", "padding-right": "10px"}}>
                            <input type="text" className="form-control" value={dateToPicker(todo.ddl_time)} style={{"border-radius": "10px"}}
                                   ref={input => this.inputDate = input}/>

                          </div>
                            <button type="submit" className="btn btn-default btn-sm"
                                    style={{"border-radius": "7px", "margin-left": "5px"}}
                                    onClick={()=>onChangeDate(todo, this.inputDate.value)}>确定</button>
						</span></li>
						<li role="separator" className="divider"/>
					    <li style={{"padding": "11px"}}><p>优先级</p>
						<div className="btn-group btn-group-sm" role="group" style={{"display": "table-cell"}}>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#ff1493", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P4)}/>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#ff8c00", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P3)}/>
                          <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "#4169e1", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P2)}/>
						  <button type="button" className="btn glyphicon glyphicon-glyphicon glyphicon-fire"
                                  style={{"color": "grey", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P1)}/>
                        </div>
						</li>
						<li role="separator" className="divider"/>
					    <li><a href="#" onClick={()=>onDelete(todo)}>
                            <span className="action-btn-inactive-icon glyphicon glyphicon-remove-circle"/>
                            <span>
                                {(todo.state === CONSTANT.ACTIVE_NOT_DELETED ||
                                    todo.state === CONSTANT.DONE_NOT_DELETED ||
                                    todo.state === CONSTANT.EXPIRED_NOT_DELETED) ? '删除' : '恢复'}
                            </span>
					    </a></li>
					  </ul>
					</div>
				  </span>
            </li>
                
        )
    }
}


//绑定数据验证到Item上
// Item.propTypes = propTypes;