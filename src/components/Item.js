
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
       
    }


    
    render() {

        
        
        let {todo, onDelete, onToggle, onChangePriority, onChangeDisplay, onChangeTag, onChangeDate} = this.props;


        return(
            <li className={todo.state === CONSTANT.DONE_NOT_DELETED?"task finished-task":"task"} onClick={()=>onChangeDisplay(todo)}>
                <div className={todo.state === CONSTANT.DONE_NOT_DELETED?"glyphicon glyphicon-check checkbox-icon":"glyphicon glyphicon-unchecked checkbox-icon"}
                     style={{"padding": "5px", "display": "inline-block"}}
                     onClick={()=>onToggle(todo)}/>
                <div style={{"display": "inline-block"}}>{todo.title === 'NULL' ? '' : todo.title}</div>
                <span style={{"float": "right", "display": "inline-block"}}>
					<span className="action-btn btn-group" style={{"margin": "0", "padding": "0"}}>
                      <button type="button" className="btn btn-default dropdown-toggle btn-xs task-project-name"
                              style={{"border": "none"}} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {todo.tag === 'default' ? '未设置' : todo.tag}<span className="caret" style={{"margin-left": "3px"}}/>
                      </button>
                      <ul className="dropdown-menu" style={{"position": "absolute", "left": "-100px"}}>
                          {
                              this.props.todoTags.map(tag=> {
                                  return(
                                      <li><a href="#" onClick={()=>onChangeTag(todo, tag)}>
                                          <span className="action-btn-icon glyphicon glyphicon-tag"/>
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
					  <ul className="dropdown-menu" style={{"position": "absolute", "left": "-200px"}}>
					    <li style={{"padding": "11px"}}><p>到期日</p>
                            {/*<MyDatePicker/>*/}
						  <div className="input-group date" data-provide="datepicker"
                               style={{"padding-left": "10px", "padding-right": "10px"}}>
                            <input type="text" className="form-control" value={dateToPicker(todo.ddl_time)} style={{"border-radius": "10px"}}
                                   ref={input => this.inputDate = input}/>

                          </div>
                          <button type="submit" className="btn btn-default btn-sm"
                                    style={{"border-radius": "7px", "position": "absolute", "right": "25px", "margin-top": "5px"}}
                                    onClick={()=>onChangeDate(todo, this.inputDate.value)}>确定</button>
						</li>
						<li role="separator" className="divider" style={{"margin-top": "30px"}}/>
					    <li style={{"padding": "11px"}}><p>优先级</p>
						<div className="btn-group btn-group-sm" role="group" style={{"display": "table-cell"}}>
                          <button type="button" className={(todo.priority === CONSTANT.P4 ?
                              'active ' : '') + 'btn glyphicon glyphicon-glyphicon glyphicon-fire'}
                                  style={{"color": "#ff1493", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P4)}/>
                          <button type="button" className={(todo.priority === CONSTANT.P3 ?
                              'active ' : '') + 'btn glyphicon glyphicon-glyphicon glyphicon-fire'}
                                  style={{"color": "#ff8c00", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P3)}/>
                          <button type="button" className={(todo.priority === CONSTANT.P2 ?
                              'active ' : '') + 'btn glyphicon glyphicon-glyphicon glyphicon-fire'}
                                  style={{"color": "#4169e1", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P2)}/>
						  <button type="button" className={(todo.priority === CONSTANT.P1 ?
                              'active ' : '') + 'btn glyphicon glyphicon-glyphicon glyphicon-fire'}
                                  style={{"color": "grey", "background-color": "white"}}
                                  onClick={()=>onChangePriority(todo, CONSTANT.P1)}/>
                        </div>
						</li>
						<li role="separator" className="divider"/>
					    <li><a href="#" onClick={()=>onDelete(todo)}>
                            <span className="action-btn-icon glyphicon glyphicon-remove-circle"/>
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