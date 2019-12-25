import Item from "./Item"; //每一项todo组件
import Right from "./right";
import React from 'react';
import * as CONSTANT from './Common';

import 'babel-polyfill';
import ItemsConstructor from "./ItemsConstructor";

// 引入样式
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
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.itemEditDone = this.itemEditDone.bind(this);
        this.onChangeDisplay = this.onChangeDisplay.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.setExpired = this.setExpired.bind(this);
        this.onChangeTag = this.onChangeTag.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.onRef = this.onRef.bind(this);

        // this.props.tasks.forEach(task=> {
        //     let date = new Date();
        //     let today = date.toLocaleDateString();
        //     alert(task['title'] + ' ' + task['ddl_time'] + ' ' + today);
        //     if (task['ddl_time'] < today) {
        //         this.setExpired(task);
        //     }
        // })
    }

    async addTask(token, title, content = 'NULL', state = CONSTANT.ACTIVE_NOT_DELETED, priority = CONSTANT.P1) {
        try {
            let res = await superagent
                .post('http://aliyun.nihil.top:10999/api/task/add?SecretKey=kdK4AnNlLm')
                .set('token', token)
                .send({
                    'title': title,
                    "content": content,
                    "state": state,
                    "priority": priority,
                    'tag':'default',
                    'ddl_time':'2020-02-02 00:00:00'
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
        task.done_time = '0000-00-00 00:00:00';
        task.ddl_time = '2020-02-02 00:00:00';

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
                .post('http://aliyun.nihil.top:10999/api/task/modify?SecretKey=kdK4AnNlLm')
                .set('token', token)
                .send({
                    'id': id,
                    'title': title,
                    "content": content,
                    "state": state,
                    "priority": priority,
                    'tag': tag,
                    'ddl_time': ddl_time
                });
            return res;
        } catch(err) {
            alert(err);
            alert('修改失败！');
            return -1;
        }
    }

    async setExpired(task) {
        let {token} = this.state;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], CONSTANT.EXPIRED_NOT_DELETED,
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onDelete(task) {
        let {token} = this.state;

        let state;

        switch (task['state']) {
            case CONSTANT.ACTIVE_NOT_DELETED:
                state = CONSTANT.ACTIVE_OR_EXPIRED_DELETED;
                break;
            case CONSTANT.DONE_NOT_DELETED:
                state = CONSTANT.DONE_DELETED;
                break;
            case CONSTANT.EXPIRED_NOT_DELETED:
                state = CONSTANT.ACTIVE_OR_EXPIRED_DELETED;
                break;
            case CONSTANT.ACTIVE_OR_EXPIRED_DELETED:
                state = CONSTANT.ACTIVE_NOT_DELETED;
                break;
            case CONSTANT.DONE_DELETED:
                state = CONSTANT.DONE_NOT_DELETED;
                break;
            default:
                state = task['state'];
        }

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], state,
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onToggle(task) {
        let {token} = this.state;

        let state;

        switch (task['state']) {
            case CONSTANT.ACTIVE_NOT_DELETED:
                state = CONSTANT.DONE_NOT_DELETED;
                break;
            case CONSTANT.DONE_NOT_DELETED:
                state = CONSTANT.ACTIVE_NOT_DELETED;
                break;
            case CONSTANT.EXPIRED_NOT_DELETED:
                state = CONSTANT.DONE_NOT_DELETED;
                break;
            default:
                state = task['state'];
        }

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], state,
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            updatePage();
        }
    }

    async onChangeDate(task, date) {
        let {token} = this.state;

        // 12/20/2019
        // 2020-02-02 00:00:00
        let temp = date.split('/');
        date = temp[2] + '-' + temp[0] + '-' + temp[1] + ' 00:00:00';

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], CONSTANT.ACTIVE_NOT_DELETED,
            task['priority'], task['tag'], date);

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

        task['title'] = title === '' ? 'NULL' : title;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], task['state'],
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            await updatePage();
            // await this.onChangeDisplay(task);
        }
    }

    async onChangeContent(task, content) {
        let {token} = this.state;

        task['content'] = content === '' ? 'NULL' : content;

        let res = await this.modifyTask(token, task['id'], task['title'], task['content'], task['state'],
            task['priority'], task['tag'], task['ddl_time']);

        if (res) {
            let {updatePage} = this.props;
            await updatePage();
            // await this.onChangeDisplay(task);
        }
    }

    onChangeDisplay(task) {
        this.click(false);
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
                    todoTags: this.props.tags,
                    todo:task,
                    onChangeDisplay: this.onChangeDisplay,
                    onDelete: this.onDelete,
                    onToggle: this.onToggle,
                    itemEditDone: this.itemEditDone,
                    onChangePriority: this.onChangePriority,
                    onChangeTag: this.onChangeTag,
                    onChangeDate: this.onChangeDate
                }}
            />
        )
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    onRef(ref){
        this.child = ref;
    }

    click(trueOrFalse) {
        this.child.setDefaultView(trueOrFalse);
    }

    render(){
        let state = this.state;

        let tasks = this.props.tasks;

        let itemBox = null;
        switch(state.sortType) {
            case 'tag':
                itemBox = this.props.tags.map(tag=> {
                    let key = tag;
                    let value = tasks.filter(task=>{
                        return task['tag'] === tag
                    }).map(task=> {
                        return (
                            this.makeItem(task)
                        )
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
                            tasks.filter(task=> {
                                return task['priority'] === CONSTANT.P4
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
                            })
                        )
                    },
                    {
                        key:'中',
                        value:(
                            tasks.filter(task=> {
                                return task['priority'] === CONSTANT.P3
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
                            })
                        )
                    },
                    {
                        key:'低',
                        value:(
                            tasks.filter(task=> {
                                return task['priority'] === CONSTANT.P2
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
                            })
                        )
                    },
                    {
                        key:'无',
                        value:(
                            tasks.filter(task=> {
                                return task['priority'] === CONSTANT.P1
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
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
                            tasks.filter(task=> {
                                return task['state'] === CONSTANT.EXPIRED_NOT_DELETED
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
                            })
                        )
                    },
                    {
                        key:'未过期',
                        value:(
                            tasks.filter(task=> {
                                return task['state'] !== CONSTANT.EXPIRED_NOT_DELETED
                            }).map(task=> {
                                return (
                                    this.makeItem(task)
                                )
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

        let title;

        switch (this.props.viewType) {
            case 'today':
                title = '今日';
                break;
            case 'seven':
                title = '最近7天';
                break;
            case 'all':
                title = '收集箱';
                break;
            case 'done':
                title = '已完成';
                break;
            case 'deleted':
                title = '垃圾桶';
                break;
            default:
                title = this.props.viewType;
        }

        return(
            <div style={{'height': '100%'}}>
                <div className="col-md-6" style={{'height': '100%', 'border-right':'1px solid #d3d3d3', 'padding-left':'30px'}}>
                    <header className="form-inline tool-bar">
                        <div className="form-group project-name" id="project-name-bar">
                            {title}
                        </div>
                        <div className="form-group action-bar" style={{"float": "right"}}>
                            <div className="action-btn btn-group">
                                <button type="button" className="btn btn-default dropdown-toggle" style={{"border": "none"}}
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="glyphicon glyphicon-time" style={{"color": "#6495ed"}}/>
                                </button>
                                <ul className="dropdown-menu sort-menu">
                                    <li className={this.state.sortType==='default'?'active':'inactive'}>
                                        <a href="#" onClick={()=>this.changeSort('default')}>
                                            <span className="action-btn-icon glyphicon glyphicon-time"/>
                                            <span>按时间</span>
                                        </a>
                                    </li>
                                    <li className={this.state.sortType==='tag'?'active':'inactive'}>
                                        <a href="#" onClick={()=>this.changeSort('tag')}>
                                            <span className="action-btn-icon glyphicon glyphicon-list-alt"/>
                                            <span>按清单</span>
                                        </a>
                                    </li>
                                    <li className={this.state.sortType==='priority'?'active':'inactive'}>
                                        <a href="#" onClick={()=>this.changeSort('priority')}>
                                            <span className="action-btn-icon glyphicon glyphicon-fire"/>
                                            <span>按优先级</span>
                                        </a>
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
                                style={{'width': '90%', 'height': '40px', 'border': 'none', 'background-color': '#f5f5f5', 'padding': '13px', 'font-size': '14px'}}
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
                        onRef: this.onRef,
                        displayTask: state.displayTask,
                        onChangeContent: this.onChangeContent,
                        onChangeTitle: this.onChangeTitle
                    }}
                />
            </div>

        )
    }
}
