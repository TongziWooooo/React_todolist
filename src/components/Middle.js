import Item from "./Item"; //每一项todo组件
import Right from "./right";
import React from 'react';
import * as CONSTANT from './Common';

import 'babel-polyfill';
import ItemsConstructor from "./ItemsConstructor";

// 引入样式
require('style/base.css');
require('style/index.css');

var superagent = require('superagent');

// //接收的数据的数据验证
// let propTypes = {
//     todo:PT.object,   //因为我在webpack.config内已经申明好了pt，所以可以直接用PT
//     onDestroy:PT.func,
//     onToggle:PT.func,
//     itemEditDone:PT.func
// }


export default class Middle extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            tags:this.props.tags,
            inputVal:'', //用于改变input为受控组件时获取输入的值
            viewType:this.props.viewType,
            token: this.props.token,
            sortType:'default',
            displayTask:''
        };

        //给所有事件绑定this
        this.handleKeyDownPost = this.handleKeyDownPost.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.onDone = this.onDone.bind(this);
        this.itemEditDone = this.itemEditDone.bind(this);
        this.onChangeDisplay = this.onChangeDisplay.bind(this);
        this.changeSort = this.changeSort.bind(this);
    }

    async addTask(token, title, content = 'NULL', state = CONSTANT.ACTIVE_NOT_DELETED, priority = CONSTANT.P1) {
        try {
            let res = await superagent
                .post('http://127.0.0.1:8080/api/task/add?SecretKey=kdK4AnNlLm')
                .set('token', token)
                .send({
                    'title': title,
                    "content": content,
                    "state": state,
                    "priority": priority,
                    'tag':'default'
                    // 'ddl_time':'0000-00-00 00:00:00'
                });
            let json = JSON.parse(res.text);
            return json['data']['id'];
        } catch(err) {
            alert('添加失败！');
            return -1;
        }
    }

    async handleKeyDownPost(ev) {
        if(ev.keyCode !== 13) return;  //按下的不是回车则返回

        let {inputVal} = this.state;
        let token = this.state.token;
        let title = inputVal.trim();

        if(title === "") return;

        let id = await this.addTask(token, title);

        if (id === -1) {
            this.setState({
                inputVal: '',
            });
            return;
        }

        let task = {};

        task.id = id;
        task.title = title;
        task.content = 'NULL';
        task.state = CONSTANT.ACTIVE_NOT_DELETED;
        task.priority = CONSTANT.P1;
        task.doneTime = '0000-00-00 00:00:00';
        task.ddlTime = '0000-00-00 00:00:00';

        this.setState({
            inputVal: '',
        });
        // let {addTodo} = this.props;
        // addTodo(task);
        let {updatePage} = this.props;
        updatePage();

    }

    async modifyTask(token, id, title, content, state, priority, tag, ddl_time) {
        try {
            let res = await superagent
                .post('http://127.0.0.1:8080/api/task/modify?SecretKey=kdK4AnNlLm')
                .set('token', token)
                .send({
                    'title': title,
                    "content": content,
                    "state": state,
                    "priority": priority,
                    'tag': tag,
                    'ddl_time': ddl_time
                });
            return res;
        } catch(err) {
            alert('修改失败！');
            return -1;
        }
    }

    async onDelete(task) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], CONSTANT.ACTIVE_OR_EXPIRED_DELETED,
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onDone(task) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], CONSTANT.DONE_NOT_DELETED,
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangeDate(task, time) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], task['state'],
            task['priority'], task['tag'], time);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangePriority(task, priority) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], task['state'],
            priority, task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangeTag(task, tag) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], task['state'],
            task['priority'], tag, task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangeTitle(task, title) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], title, task['content'], task['state'],
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangeContent(task, content) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], content, task['state'],
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    onChangeDisplay(task) {
        this.setState({
            displayTask: task
        })
    }

    //用于传递给Item组件的事件，该事件Item的todo被双击时修改todo后的保存，保存就修改本组件的state
    itemEditDone(todo, value) {
        let {todosData} = this.state;
        //遍历去修改我们要修改的那个todo
        todosData = todosData.map(elt=>{
            if(todo.id === elt.id)
            {
                elt.value = value;
            }
            return elt;
        });
    }

    // TODO: add function
    changeSort(type) {
        this.setState({
            sortType: type
        });
    }

    inputChange(ev) {
        this.setState({
            inputVal:ev.target.value
        });
    }

    makeItem(task) {
        return(
            <Item
                {...{
                    todo:task,
                    onChangeDisplay: this.onChangeDisplay,
                    onDestroy: this.onDelete,
                    onToggle: this.onDone,
                    itemEditDone: this.itemEditDone
                }}
            />
        )
    }

    render(){
        let state = this.state;

        let tasks = this.props.tasks;

        let itemBox = null;
        switch(state.sortType) {
            case 'tag':
                itemBox = state.tags.map(tag=> {
                    let key = tag;
                    let value = tasks.map(task=> {
                        if (task['tag'] === tag) {
                            return (
                                this.makeItem(task)
                            )
                        }
                    });
                    return {
                        key: key,
                        value: value
                    }
                });
                break;
            case 'priority':
                itemBox = [
                    {
                        key:'高',
                        value:(
                            tasks.map(task=> {
                                if (task['priority'] === CONSTANT.P4) {
                                    return (
                                        this.makeItem(task)
                                    )
                                }
                            })
                        )
                    },
                    {
                        key:'中',
                        value:(
                            tasks.map(task=> {
                                if (task['priority'] === CONSTANT.P3) {
                                    return (
                                        this.makeItem(task)
                                    )
                                }
                            })
                        )
                    }
                ];
                break;
            default:
                itemBox = [
                    {
                        key:'已过期',
                        value:(
                            tasks.map(task=> {
                                if (task['state'] === CONSTANT.EXPIRED_NOT_DELETED) {
                                    return (
                                        this.makeItem(task)
                                    )
                                }
                            })
                        )
                    },
                    {
                        key:'未过期',
                        value:(
                            tasks.map(task=> {
                                if (task['state'] !== CONSTANT.EXPIRED_NOT_DELETED) {
                                    return (
                                        this.makeItem(task)
                                    )
                                }
                            })
                        )
                    }
                ]
        }

        let Child = (
            <ItemsConstructor
                {...{
                    boxDict: itemBox
                }}
            />
        );

        return(
            <div>
                <div className="col-md-6" style={{'height': '100%', 'border-right':'1px solid #d3d3d3', 'border-left':'1px solid #d3d3d3'}}>
                    <header className="form-inline tool-bar">
                        <div className="form-group project-name" id="project-name-bar">
                            <h3 contentEditable="true">这是一个标题</h3>
                        </div>
                        <div className="form-group action-bar" style={{"float": "right"}}>
                            <div className="action-btn btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle" style={{"border": "none"}}
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="glyphicon glyphicon-time" style={{"color": "#6495ed"}}/>
                                </button>
                                <ul className="dropdown-menu">
                                    <li className="active"><a href="#"><span
    className="action-btn-active-icon glyphicon glyphicon-time"/><span>按时间</span></a>
                                    </li>
                                    <li><a href="#"><span
    className="action-btn-inactive-icon glyphicon glyphicon-list-alt"/><span>按清单</span></a>
                                    </li>
                                    <li><a href="#"><span
    className="action-btn-inactive-icon glyphicon glyphicon-fire"/><span>按优先级</span></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </header>
                    <div className="add-task" style={{"height": "70px"}}>
                        <div>
                            <label htmlFor="add-task" className="sr-only"/>
                            <input
                                id="add-task"
                                className="form-control"
                                style={{"position": "relative", "height": "50px", "border": "none", "background-color": "#f5f5f5", "padding": "10px", "font-size": "16px"}}
                                type="text"
                                value={state.inputVal}
                                onChange={this.inputChange}
                                onKeyDown={this.handleKeyDownPost}
                                placeholder="添加任务至所有，回车即可保存"
                            />
                        </div>
                    </div>
                    {Child}
                </div>
                <Right
                    {...{
                        displayTask: state.displayTask
                    }}
                />
            </div>

        )
    }
}
